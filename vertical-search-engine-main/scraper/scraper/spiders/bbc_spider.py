import scrapy
from ..items import NewsItem

class BbcSpider(scrapy.Spider):
    name = "bbc_spider"

    categories = ['politics', 'health', 'business']
    max_pages_per_category = 200

    def start_requests(self):
        for category in self.categories:
            for page in range(self.max_pages_per_category):
                url = f"https://www.bbc.com/search?q={category}&page={page}&edgeauth=eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJrZXkiOiAiZmFzdGx5LXVyaS10b2tlbi0xIiwiZXhwIjogMTc0MjAxNzE0NywibmJmIjogMTc0MjAxNjc4NywicmVxdWVzdHVyaSI6ICIlMkZzZWFyY2glM0ZxJTNEcG9saXRpY3MlMjZwYWdlJTNEMCJ9.ruj1tlewBoF2SzmOHRkDcjBe-ANpQeHidA_jU5wvA4M"
                yield scrapy.Request(url, callback=self.parse, meta={'category': category})

    def parse(self, response):
        category = response.meta['category']
        news_items = response.css("div.result-container")

        if not news_items:
            return

        for news in news_items:
            relative_url = news.css('h3.title a::attr(href)').get()
            if relative_url:
                publication_url = response.urljoin(relative_url)
                yield scrapy.Request(publication_url, callback=self.parse_publication, meta={'category': category})

    def parse_publication(self, response):
        item = NewsItem()
        item['title'] = response.css('h1::text').get().strip()
        item['content'] = ' '.join(response.css('article p::text').getall()).strip()
        item['category'] = response.meta['category']
        item['publication_url'] = response.url
        yield item
