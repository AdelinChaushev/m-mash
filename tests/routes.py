"""Smoke-test the public Apache routes without contacting SES or Mailpit."""

import sys
from html.parser import HTMLParser
from urllib.error import HTTPError
from urllib.parse import urljoin, urlsplit
from urllib.request import HTTPRedirectHandler, build_opener
from xml.etree import ElementTree


class NoRedirects(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.links = []
        self.ids = set()
        self.forms = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('a', 'link') and 'href' in attrs:
            self.links.append(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'form':
            self.forms.append(attrs)


base = sys.argv[1].rstrip('/') + '/' if len(sys.argv) > 1 else 'http://m-mash.test/'
origin = 'https://m-mash.net/'
languages = ('bg', 'en', 'de', 'it')
slugs = (
    ('', 'za-nas', 'proizvodstvo', 'uslugi', 'kachestvo', 'kontakti'),
    ('en/', 'en/about', 'en/capabilities', 'en/services', 'en/quality', 'en/contact'),
    ('de/', 'de/ueber-uns', 'de/fertigung', 'de/leistungen', 'de/qualitaet', 'de/kontakt'),
    ('it/', 'it/chi-siamo', 'it/capacita', 'it/servizi', 'it/qualita', 'it/contatti'),
)
opener = build_opener(NoRedirects())


def request(path):
    url = urljoin(base, path)
    try:
        with opener.open(url, timeout=10) as response:
            return response.status, response.headers, response.read()
    except HTTPError as response:
        with response:
            return response.code, response.headers, response.read()


def redirect(old, new):
    query = '?ref=route-test'
    status, headers, _ = request(old + query)
    assert status == 301 and urljoin(base, headers['Location']) == urljoin(base, new) + query, (
        old, status, headers.get('Location')
    )


pages = {}
for rows in zip(*slugs, strict=True):
    for route in rows:
        status, headers, body = request(route)
        assert status == 200 and headers.get_content_type() == 'text/html', (route, status)
        page = pages[urljoin(base, route)] = Page(body.decode())
        assert [a['href'] for a in page.links if a.get('rel') == 'canonical'] == [origin + route], route
        assert {a['hreflang']: a['href'] for a in page.links if a.get('rel') == 'alternate'} == {
            lang: origin + alternate for lang, alternate in zip(languages, rows, strict=True)
        }, route
        assert {a['hreflang']: urljoin(urljoin(base, route), a['href'])
                for a in page.links if 'hreflang' in a and 'lang' in a} == {
            lang: urljoin(base, alternate) for lang, alternate in zip(languages, rows, strict=True)
        }, route
        if not route or route.endswith('/'):
            redirect(route + 'index.html', route)
            if route:
                redirect(route.rstrip('/'), route)
        else:
            redirect('vazmozhnosti.html' if route == 'proizvodstvo' else route + '.html', route)
            redirect(route + '/', route)

for slug in ('vazmozhnosti', 'vazmozhnosti/'):
    redirect(slug, 'proizvodstvo')

status, _, body = request('dizain-sistema.html')
assert status == 200
pages[urljoin(base, 'dizain-sistema.html')] = Page(body.decode())
assets = set()
for url, page in pages.items():
    for a in page.links:
        value = a['href']
        if urlsplit(value).scheme or value.startswith('//'):
            continue
        link = urlsplit(urljoin(url, value))
        target = link._replace(query='', fragment='').geturl()
        if target.startswith(urljoin(base, 'assets/')):
            assets.add(link._replace(fragment='').geturl())
        else:
            assert target in pages and (not link.fragment or link.fragment in pages[target].ids), (url, value)

for asset in assets | {urljoin(base, 'assets/js/site.js'), urljoin(base, 'assets/img/m-mash-mark.svg')}:
    assert request(asset)[0] == 200, asset

for routes, anchor in zip(slugs, ('zapitvane', 'inquiry', 'anfrage', 'richiesta'), strict=True):
    url = urljoin(base, routes[-1])
    assert anchor in pages[url].ids
    assert any(form.get('method') == 'post' and urljoin(url, form['action']) == urljoin(base, 'contact-submit.php')
               for form in pages[url].forms), url

status, _, body = request('sitemap.xml')
assert status == 200
ns = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
locations = [loc.text for loc in ElementTree.fromstring(body).iter(ns + 'loc')]
assert len(locations) == 24 and set(locations) == {origin + route for routes in slugs for route in routes}
status, _, robots = request('robots.txt')
assert status == 200 and f'Sitemap: {origin}sitemap.xml' in robots.decode().splitlines()
for path in ('not-a-page', 'not-a-page.html', 'src/contact-copy.php', 'config/deploy.yaml', 'assets/'):
    assert request(path)[0] in (403, 404), path

print(f'{base}: 24 canonical routes, redirects, internal links, anchors, assets and sitemap passed.')
