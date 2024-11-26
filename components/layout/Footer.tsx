const Footer: React.FC = () => {
  return (
    <footer className="bg-black-dark text-white text-center py-4">
      &copy; {new Date().getFullYear()} FitFlow. All rights reserved.
    </footer>
  );
};

export default Footer;
