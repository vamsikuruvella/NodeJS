const Footer = () => {
  return (
    <footer className="footer footer-horizontal bg-neutral text-neutral-content p-10 mt-10">
      <aside>
        <h2 className="text-2xl font-bold text-primary">💙 DevTinder</h2>
        <p className="max-w-xs">
          Built with ❤️ by Vamsi Kuruvella.
          <br />
          DevTinder is a personal full-stack project inspired by professional networking platforms, built for learning and showcasing engineering skills.
        </p>

        <p className="text-sm opacity-70 mt-4">
          © {new Date().getFullYear()} DevTinder. All rights reserved.
        </p>
      </aside>

      <nav>
        <h6 className="footer-title">Platform</h6>
        <a href="/feed" className="link link-hover">
          Discover Developers
        </a>
        <a href="/connections" className="link link-hover">
          Connections
        </a>
        <a href="/requests" className="link link-hover">
          Requests
        </a>
        <a href="/profile" className="link link-hover">
          Profile
        </a>
      </nav>

      <nav>
        <h6 className="footer-title">Resources</h6>
        <a className="link link-hover">About</a>
        <a className="link link-hover">Privacy Policy</a>
        <a className="link link-hover">Terms of Service</a>
        <a className="link link-hover">Contact</a>
      </nav>

      <nav>
        <h6 className="footer-title">Connect</h6>

        <div className="flex gap-4">

          <a
            href="https://github.com/vamsikuruvella"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/vamsi-kuruvella-7859b0144/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors"
          >
            LinkedIn
          </a>

          

        </div>
      </nav>
    </footer>
  );
};

export default Footer;