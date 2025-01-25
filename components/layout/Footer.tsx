const Footer: React.FC = () => {
  return (
    <footer className="bg-green-300 text-white text-center py-4">
      &copy; {new Date().getFullYear()} FitFlow. All rights reserved.
    </footer>
  );
};

export default Footer;
