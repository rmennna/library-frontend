import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2, FiSearch, FiEdit } from 'react-icons/fi';

import api from '../../../services/api';

import '../../Home/Administrador/index.css';

export default function Home() {
  const user = localStorage.getItem('user');
  const [books, setBooks] = useState([]);
  const [bookSearch, setBookSearch] = useState('');

  const history = useHistory();

  useEffect(() => {
    api.get('/books').then((response) => {
      setBooks(response.data);
    });
  }, []);

  function handleLogout() {
    localStorage.clear();
    history.push('/');
  }

  async function handleDeleteBook(id) {
    await api.delete(`/book/${id}`);
    setBooks(books.filter((book) => book.id !== id));
  }

  function handleEditBook(book) {
    history.push('/book/edit', book);
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (bookSearch === null) {
      api.get('/books').then((response) => {
        setBooks(response.data);
      });
    } else {
      const response = await api.get(`/book/search?name=${bookSearch}`);
      setBooks(response.data);
    }
  }

  async function handleChangeValid(book) {
    const newBooks = [];
    books.map((item) => {
      if (item.id === book.id) {
        book.valid = !book.valid;
        return newBooks.push(book);
      }
      return newBooks.push(item);
    });
    await api.patch(`/book/valid/${book.id}`);
    setBooks(newBooks);
  }

  return (
    <div className="home-container">
      <header>
        <span> Bem vindo, {user}</span>
        <Link className="button" to="/book/new">
          New book
        </Link>
        <button type="button" onClick={handleLogout}>
          <FiPower size="18" color="#99ccff" />
        </button>
      </header>

      <div className="sub-header">
        <h1>Biblioteca</h1>

        <div className="search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
            />
            <button type="submit">
              <FiSearch />
            </button>
          </form>
        </div>
      </div>

      <ul>
        {books.map((book) => (
          <div key={book.id}>
            <div className="bookSelected">
              <li>
                <strong>Título:</strong>
                <p>{book.name}</p>

                <strong>Autor:</strong>
                <p>{book.autor}</p>

                <strong>ISBN:</strong>
                <p>{book.isbn}</p>
              </li>
            </div>
            <div className="footer">
              <button type="button" onClick={() => handleEditBook(book)}>
                <FiEdit size="20" color="99ccff" />
              </button>
              <button
                type="button"
                className="apagar"
                onClick={() => handleDeleteBook(book.id)}
              >
                <FiTrash2 size="20" color="99ccff" />
              </button>

              <div className="available">
                <p>{book.valid === true ? 'Disponível' : 'Indisponível'}</p>
                <input
                  type="checkbox"
                  onClick={() => handleChangeValid(book)}
                  checked={book.valid}
                />
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
