import { useEffect, useState } from "react";
import api from "../services/api";
import BookForm from "../components/BookForm";
import EditBook from "../components/EditBook";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch Books
  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Delete Book
  const deleteBook = async (id) => {
    try {
      await api.delete(`/books/${id}`);
      alert("Book deleted successfully!");
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book");
    }
  };

  // After Editing
  const handleBookUpdated = () => {
    setSelectedBook(null);
    fetchBooks();
  };

  // Search
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  // Sort
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortOption) {
      case "titleAsc":
        return a.title.localeCompare(b.title);

      case "titleDesc":
        return b.title.localeCompare(a.title);

      case "yearNewest":
        return b.publishedYear - a.publishedYear;

      case "yearOldest":
        return a.publishedYear - b.publishedYear;

      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;

  const currentBooks = sortedBooks.slice(
    indexOfFirstBook,
    indexOfLastBook
  );

  return (
  <>
    <Navbar />

    <div className="container mt-4">

      <div className="row">

        {/* LEFT PANEL */}
        <div className="col-lg-4">

          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center">
              <h3>Add New Book</h3>
            </div>

            <div className="card-body">

              {/* Statistics */}
              <div className="row mb-4">

                <div className="col-4">
                  <div className="card bg-primary text-white text-center">
                    <div className="card-body">
                      <h6>Total</h6>
                      <h3>{books.length}</h3>
                    </div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="card bg-success text-white text-center">
                    <div className="card-body">
                      <h6>Available</h6>
                      <h3>
                        {books.filter((book) => book.available).length}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="card bg-danger text-white text-center">
                    <div className="card-body">
                      <h6>Unavailable</h6>
                      <h3>
                        {books.filter((book) => !book.available).length}
                      </h3>
                    </div>
                  </div>
                </div>

              </div>

              <BookForm onBookAdded={fetchBooks} />

            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="col-lg-8">

          {/* Search */}
          <input
            className="form-control mb-3"
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* Sort */}
          <select
            className="form-select mb-3"
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Sort By</option>
            <option value="titleAsc">Title (A-Z)</option>
            <option value="titleDesc">Title (Z-A)</option>
            <option value="yearNewest">Published Year (Newest)</option>
            <option value="yearOldest">Published Year (Oldest)</option>
          </select>

          {/* Edit Form */}
          {selectedBook && (
            <div className="card mb-3 shadow">
              <div className="card-header bg-warning">
                Edit Book
              </div>

              <div className="card-body">
                <EditBook
                  book={selectedBook}
                  onBookUpdated={handleBookUpdated}
                  onCancel={() => setSelectedBook(null)}
                />
              </div>
            </div>
          )}

          {/* Book List */}
          {currentBooks.length === 0 ? (
            <p className="text-center">No books found.</p>
          ) : (
            currentBooks.map((book) => (
              <div key={book._id} className="card shadow-sm mb-3">

                <div className="card-body">

                  <h4>{book.title}</h4>

                  <p><strong>Author:</strong> {book.author}</p>

                  <p><strong>Genre:</strong> {book.genre}</p>

                  <p><strong>Published Year:</strong> {book.publishedYear}</p>

                  <p>
                    <strong>Available:</strong>{" "}
                    {book.available ? "Yes" : "No"}
                  </p>

                  <button
                    className="btn btn-primary me-2"
                    onClick={() => setSelectedBook(book)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      if (window.confirm("Delete this book?")) {
                        deleteBook(book._id);
                      }
                    }}
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">

              <button
                className="btn btn-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>

              <span className="fw-bold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="btn btn-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>

            </div>
          )}

        </div>

      </div>

    </div>

    <Footer />
  </>
);
}

export default Home;