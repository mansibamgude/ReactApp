import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Navbar, Nav, Pagination, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';

const API_KEY = '59744e22ca694f9aa35d0c5fd7fd2307'; // Replace with your NewsAPI key
const PAGE_SIZE = 5;

function App() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('general');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
          params: {
            category,
            pageSize: PAGE_SIZE,
            page,
            apiKey: API_KEY,
            language: 'en' // Add this line to filter news by English language
          }
        });
        setArticles(response.data.articles);
        setTotalResults(response.data.totalResults);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
      setLoading(false);
    };

    fetchArticles();
  }, [category, page]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1); // Reset to first page when category changes
  };

  const totalPages = Math.ceil(totalResults / PAGE_SIZE);

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">NewsApp</Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Row>
          <Col md={12}>
            <CategoryFilter onSelectCategory={handleCategoryChange} currentCategory={category} />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {loading ? (
              <div className="d-flex justify-content-center mt-4">
                <Spinner animation="border" />
              </div>
            ) : (
              <NewsList articles={articles} />
            )}
          </Col>
        </Row>
        <Row>
          <Col md={12} className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.Prev onClick={() => setPage(page > 1 ? page - 1 : page)} disabled={page === 1} />
              <Pagination.Next onClick={() => setPage(page < totalPages ? page + 1 : page)} disabled={page === totalPages} />
            </Pagination>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function CategoryFilter({ onSelectCategory, currentCategory }) {
  const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

  return (
    <Nav variant="pills" className="justify-content-center mb-4">
      {categories.map(category => (
        <Nav.Item key={category}>
          <Nav.Link
            onClick={() => onSelectCategory(category)}
            active={currentCategory === category}
          >
            {category}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}

function NewsList({ articles }) {
  return (
    <Row>
      {articles.map((article, index) => (
        <Col md={4} key={index} className="mb-4">
          <div className="card h-100">
            {article.urlToImage && (
              <img src={article.urlToImage} className="card-img-top" alt={article.title} />
            )}
            <div className="card-body">
              <h5 className="card-title">{article.title}</h5>
              <p className="card-text">{article.description}</p>
              <a href={article.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">Read more</a>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default App;
