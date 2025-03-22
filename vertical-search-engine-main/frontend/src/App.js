import { useState } from 'react';
import './App.css';
import logo from './logo.svg';

function SearchBar({ onSearch, placeholder }) {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
}

function ItemList({ items }) {
  return (
    <ul className="item-list">
      {items.map((item, index) => (
        <li key={index} className="item">
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="result-title">
            {item.title}
          </a>
          <p className="result-url">{item?.url}</p>
          <p className="result-description">{item?.description}</p>
          <p className="result-meta">
            <strong>Journal:</strong> {item?.journal} | <strong>Year:</strong> {item?.year} | <strong>Authors:</strong> {item?.authors}
          </p>
          <small className="result-score">Score: {item.score}</small>
        </li>
      ))}
    </ul>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
}

function PublicationPage({ results, currentPage, totalPages, onPageChange, onSearch }) {
  const resultsPerPage = 5;
  const displayedResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <>
      <SearchBar onSearch={onSearch} placeholder="Search publications." />
      <ItemList items={displayedResults} />
      {results.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}

function PredictionPage({ category, onPredict }) {
  return (
    <>
      <SearchBar onSearch={onPredict} placeholder="Enter text to predict category." />
      
      {category && (
        <>
        <p className="prediction-result" style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginTop: '20px' }}>
        Prediction: {category}
        </p>
        <p className="prediction-result" style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginTop: '20px' }}>Accuracy: 67.2 %</p>
        <p className="prediction-result" style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginTop: '20px' }}>F1 Score: 0.661</p>
      </>
      )}
    </>
  );
}

function App() {
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('');
  const [activePage, setActivePage] = useState('publication');
  const resultsPerPage = 2;

  const fetchResults = async (query) => {
    try {
      const response = await fetch('/cu_publication/_search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: { "multi_match": { query, "fields": ["title", "description", "journal", "authors"] } } })
      });
      const data = await response.json();
      const searchResults = data.hits.hits.map((hit) => ({
        url: hit._source.publication_url || '#',
        title: hit._source.title || 'No Title',
        description: hit._source.abstract || 'No Description',
        score: hit._score,
        journal: hit._source.journal || 'Unknown Journal',
        year: hit._source.publication_year || 'Unknown Year',
        authors: hit._source.authors || ['Unknown Author']
      }));
      setResults(searchResults);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const fetchCategory = async (text) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setCategory(data?.prediction[0] || 'No Prediction');
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const totalPages = Math.ceil(results.length / resultsPerPage);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Logo" className="app-logo" />
        <nav className="navigation" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button style={{ margin: '0 10px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }} onClick={() => setActivePage('publication')}>Publication</button>
          <button style={{ margin: '0 10px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }} onClick={() => setActivePage('prediction')}>Prediction</button>
        </nav>
        {activePage === 'publication' ? (
          <PublicationPage
            results={results}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onSearch={fetchResults}
          />
        ) : (
          <PredictionPage category={category} onPredict={fetchCategory} />
        )}
      </header>
    </div>
  );
}

export default App;
