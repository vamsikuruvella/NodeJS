const Footer = () => {
  return (
    <footer className="footer bg-neutral text-neutral-content p-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">

        <nav className="flex flex-col gap-2">
          <h6 className="footer-title">Platform</h6>

          <a href="/feed" className="link link-hover">Discover Developers</a>
          <a href="/connections" className="link link-hover">Connections</a>
          <a href="/requests" className="link link-hover">Requests</a>
          <a href="/profile" className="link link-hover">Profile</a>
        </nav>

        <nav className="flex flex-col gap-2">
          <h6 className="footer-title">Resources</h6>

          <a className="link link-hover">About</a>
          <a className="link link-hover">Privacy Policy</a>
          <a className="link link-hover">Terms of Service</a>
          <a className="link link-hover">Contact</a>
        </nav>

        <nav className="flex flex-col gap-2">
          <h6 className="footer-title">Connect</h6>

          <a
            href="https://github.com/vamsikuruvella"
            target="_blank"
            rel="noreferrer"
            className="link link-hover"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/vamsi-kuruvella-7859b0144/"
            target="_blank"
            rel="noreferrer"
            className="link link-hover"
          >
            LinkedIn
          </a>
        </nav>

        <aside className="max-w-sm">
          <h2 className="text-2xl font-bold text-primary">💙 DevConnect</h2>

          <p className="mt-2">
            Built with ❤️ by Vamsi Kuruvella.
            <br />
            DevTinder is a personal full-stack project inspired by professional
            networking platforms, built to learn, experiment, and showcase modern
            web development skills.
          </p>

          <p className="text-sm opacity-70 mt-4">
            © {new Date().getFullYear()} DevTinder. All rights reserved.
          </p>
        </aside>
      </div>


    </footer>
  );
};

export default Footer;