/bin/sh
0 2 * * 1 cd /Users/ganeshpandey/Desktop/upwork/digitalPower/search-engine-django/crawler && /usr/bin/scrapy crawl ycu_spider >> /var/log/cu_spider.log 2>&1


#The cron schedule 0 2 * * 1 means:
#
#0 → Minute 0 (at the start of the hour)
#2 → Hour 2 AM
#* → Every day of the month
#* → Every month
#1 → Monday (1 represents Monday, 0 represents Sunday)
#Execution Time:
#Your Scrapy spider will run every Monday at 2:00 AM


#>> /path/to/logfile.log 2>&1