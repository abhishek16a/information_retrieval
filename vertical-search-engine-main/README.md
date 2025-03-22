# **Publication Search System**

## **Overview**

This project is a **Publication Search System** that scrapes research publications from **Coventry University’s research portal**, stores the data in **Elasticsearch**, and provides a **React-based search interface** that retrieves the top 10 most relevant results.

## **Project Architecture**

```
       +--------------------------------------------------+
       |            Web Source (University Portal)       |
       |  - Publications List & Details Pages            |
       +--------------------------------------------------+
                             |
                             v
       +--------------------------------------------------+
       |          1️⃣ Scrapy Spider (Data Collection)      |
       |  - Crawls publication pages                      |
       |  - Extracts title, authors, abstract, etc.       |
       |  - Stores data in Elasticsearch                  |
       +--------------------------------------------------+
                             |
                             v
       +--------------------------------------------------+
       |          2️⃣ Elasticsearch (Data Indexing)       |
       |  - Stores structured publication data           |
       |  - Supports full-text search                    |
       |  - Ranks results based on relevance score       |
       +--------------------------------------------------+
                             |
                             v
       +--------------------------------------------------+
       |          3️⃣ Backend API (Flask)       |
       |  - Receives search queries from React           |
       |  - Calls Elasticsearch API to retrieve results  |
       |  - Returns top 10 relevant publications         |
       +--------------------------------------------------+
                             |
                             v
       +--------------------------------------------------+
       |        4️⃣ React Frontend (Search UI)           |
       |  - User enters a search query                   |
       |  - Sends request to backend API                 |
       |  - Displays top 10 ranked results               |
       +--------------------------------------------------+
```

## **Technologies Used**

- **Scrapy** → Web scraping for publication data
- **Elasticsearch** → Storage & full-text search engine
- **Elastic Search API** → Backend API for querying Elasticsearch
- **React** → Frontend for user search interface
- **Selenium Middleware** → Handles JavaScript-rendered pages in Scrapy

## **Installation & Setup**

### **1️⃣ Setup Elasticsearch**

1. Clone the repository:
   ```bash
   git clone https://github.com/abhishek16a/information_retrieval.git
   cd information_retrieval/vertical-search-engine
   ```

1. Install Elasticsearch:
   ```bash
   docker-compose up -d
   ```
2. Verify Elasticsearch is running:
   ```bash
   curl -X GET "http://localhost:9200"
   ```

### **2️⃣ Setup Scrapy Spider**

1. Install dependencies using pipenv:
   ```bash
   pipenv install
   ```
2. Go inside the pipenv environment:
   ```bash
   pipenv shell
   ```
3. Run Scrapy to collect data:
   ```bash
   scrapy crawl cu_spider
   ```

### **3️⃣ Setup Backend API**

1. Start the flask server:
   ```bash
   python app.py
   ```
2. Test the API:
   ```bash
   curl -X POST "http://localhost:5000/"
   ```

### **4️⃣ Setup React Frontend**

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## **Usage**

- **Scrapy** scrapes publications and stores them in Elasticsearch.
- **Elasticsearch** indexes the data for fast retrieval.
- **Flask** API provides a search endpoint.
- **React UI** allows users to search and view results.

## **Example API Request & Response**

### **Request:**

```bash
curl -X GET "http://localhost:9200/search?query=machine+learning"
```

## **Future Improvements**

- Improve **error handling** in Scrapy and API.
- Optimize **Elasticsearch ranking** for better relevance.

## **Contributors**

- **Abhishek Adhikari** – Developer
