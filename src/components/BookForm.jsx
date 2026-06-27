import { useState } from "react";
import api from "../services/api";

function BookForm({ onBookAdded }) {
  const [book, setBook] = useState({
    title: "",
    author: "",
    genre: "",
    publishedYear: "",
    available: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setBook({
      ...book,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/books", {
        ...book,
        publishedYear: Number(book.publishedYear),
      });

      alert("Book added successfully!");

      setBook({
        title: "",
        author: "",
        genre: "",
        publishedYear: "",
        available: true,
      });

      if (onBookAdded) {
        onBookAdded();
      }
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Error adding book");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <div className="mb-3">
        <label className="form-label fw-bold">Book Title</label>
        <input
          type="text"
          name="title"
          className="form-control"
          placeholder="Enter book title"
          value={book.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Author</label>
        <input
          type="text"
          name="author"
          className="form-control"
          placeholder="Enter author name"
          value={book.author}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Genre</label>
        <input
          type="text"
          name="genre"
          className="form-control"
          placeholder="Enter genre"
          value={book.genre}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Published Year</label>
        <input
          type="number"
          name="publishedYear"
          className="form-control"
          placeholder="Enter published year"
          value={book.publishedYear}
          onChange={handleChange}
        />
      </div>

      <div className="form-check mb-4">
        <input
          type="checkbox"
          name="available"
          className="form-check-input"
          id="available"
          checked={book.available}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="available">
          Available
        </label>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
      >
        ➕ Add Book
      </button>

    </form>
  );
}

export default BookForm;