import '../index.css'

function BookList({ books }) {
  return (
    <div className="row g-3 overflow-x-hidden">
      {books.map((book, index) => (
        <div key={index} className="col-6 col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm">
            {/* <div className="position-relative" style={{ height: '150px', overflow: 'hidden' }}>
              <img 
                src={book.image} 
                className="card-img-top w-100 h-100" 
                alt={book.title}
                style={{ objectFit: 'cover' }}
              />
            </div> */}

              <div className="position-relative book-image-wrapper">
  <img 
    src={book.image} 
    className="card-img-top book-cover-img" 
    alt={book.title}
  />
</div>

            {/* Scrollable Body */}
            <div className="card-body d-flex flex-column scrollable-body">
              <h5 className="card-title">{book.title}</h5>
              <p className="card-text text-muted mb-2">{book.author}</p>
              <p className="card-text flex-grow-1">{book.description}</p>
              <a 
                href={book.link} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary btn-sm mt-auto"
              >
                Read More
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookList;
