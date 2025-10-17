 import React, { useState } from 'react'
import EmotionDetector from './components/EmotionDetector'
 
 const App = () => {
   const [started, setStarted] = useState(false)

   const CREATOR_NAME = 'Rohan Shirsath'
   const SOCIAL_LINKS = [
    { label: 'GitHub', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Email', href: '#' },
   ]

  const SocialIcon = ({ label }) => {
    if (label === 'GitHub') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="me-1"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.091.682-.217.682-.482 0-.238-.009-.869-.014-1.706-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.907-.62.069-.607.069-.607 1.003.071 1.531 1.031 1.531 1.031.892 1.528 2.341 1.087 2.91.832.091-.647.35-1.087.636-1.337-2.22-.252-4.555-1.11-4.555-4.944 0-1.091.39-1.985 1.029-2.684-.103-.253-.446-1.27.098-2.646 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.503.337 1.909-1.295 2.748-1.026 2.748-1.026.546 1.376.203 2.393.1 2.646.64.699 1.028 1.593 1.028 2.684 0 3.842-2.338 4.688-4.565 4.936.359.309.678.92.678 1.855 0 1.338-.012 2.417-.012 2.746 0 .267.18.577.688.48C19.138 20.163 22 16.416 22 12 22 6.477 17.523 2 12 2"/></svg>
      )
    }
    if (label === 'LinkedIn') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="me-1"><path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.943v5.663H9.01V9h3.111v1.561h.044c.434-.82 1.494-1.686 3.073-1.686 3.287 0 3.892 2.164 3.892 4.98v6.597zM5.337 7.433a1.804 1.804 0 1 1 0-3.609 1.804 1.804 0 0 1 0 3.609zM6.999 20.452H3.671V9h3.328v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      )
    }
    if (label === 'Email') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="me-1"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/></svg>
      )
    }
    return null
  }

   return (
      <>
        <header className="py-3 navbar-glass border-bottom mb-0">
          <div className="container d-flex align-items-center justify-content-between">
            <h1 className="m-0 fs-4 d-flex align-items-center gap-2">
              <img src="/src/assets/book-logo.svg" alt="logo" width="28" height="28" />
              Emotion-Based Book Recommender
            </h1>
          </div>
        </header>
        <main>
          <div className="container py-4 py-lg-5">
            {!started ? (
              <section className="row justify-content-center">
                <div className="col-12 col-xxl-10">
                  <div className="hero-card p-4 p-lg-5 rounded-4 shadow-sm overflow-hidden">
                    <div className="row align-items-center g-4 g-lg-5">
                      <div className="col-12 col-lg-7">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          
                        </div>
                        <h2 className="display-6 fw-semibold mb-2">Welcome</h2>
                        <p className="text-secondary mb-4">Detect your emotion in real-time and instantly get curated book recommendations that match your mood. Everything processes on your device, keeping your data private.</p>
                        <div className="row g-3 mb-4">
                          <div className="col-12 col-md-4">
                            {/* <div className="p-3 rounded-3 bg-white border text-center">
                              <div className="fw-semibold">On-device</div>
                              <div className="text-secondary small">No uploads</div>
                            </div> */}
                          </div>
                          <div className="col-12 col-md-4">
                            {/* <div className="p-3 rounded-3 bg-white border text-center">
                              <div className="fw-semibold">Fast</div>
                              <div className="text-secondary small">Optimized models</div>
                            </div> */}
                          </div>
                          <div className="col-12 col-md-4">
                            {/* <div className="p-3 rounded-3 bg-white border text-center">
                              <div className="fw-semibold">Private</div>
                              <div className="text-secondary small">Local inference</div>
                            </div> */}
                          </div>
                        </div>
                        <button className="btn btn-primary btn-lg px-4" onClick={() => setStarted(true)}>Start</button>
                      </div>
                      <div className="col-12 col-lg-5">
                        <div className="ratio ratio-4x3 hero-illustration rounded-4 d-flex align-items-center justify-content-center p-3">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
                            alt="Detective illustration"
                            className="img-fluid"
                            style={{maxHeight: '100%', objectFit: 'contain'}}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <EmotionDetector />
            )}
          </div>
        </main>
        <footer className="mt-0 py-4 bg-white border-top">
          <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between gap-2">
            <div className="text-muted">Developed By <strong>{CREATOR_NAME}</strong></div>
            <div className="d-flex gap-3">
              {SOCIAL_LINKS.map((l) => (
                <a key={l.label} className="link-secondary d-inline-flex align-items-center text-decoration-none" href={l.href} target="_blank" rel="noreferrer">
                  <SocialIcon label={l.label} />{l.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </>
   )
 }
 
 export default App