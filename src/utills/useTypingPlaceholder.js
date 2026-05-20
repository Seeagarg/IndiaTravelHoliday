import { useState, useEffect } from 'react';

const useTypingPlaceholder = (placeholders, typeSpeed = 150, backSpeed = 100, delay = 2000) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const currentText = placeholders[placeholderIndex] || '';
    let timeout;

    if (isDeleting) {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setCharIndex(prev => prev - 1);
          setCurrentPlaceholder(currentText.substring(0, charIndex - 1));
        }, backSpeed);
      } else {
        setIsDeleting(false);
        setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
      }
    } else {
      if (charIndex < currentText.length) {
        timeout = setTimeout(() => {
          setCharIndex(prev => prev + 1);
          setCurrentPlaceholder(currentText.substring(0, charIndex + 1));
        }, typeSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, placeholderIndex, placeholders, typeSpeed, backSpeed, delay]);

  return currentPlaceholder + (showCursor ? '|' : ' ');
};

export default useTypingPlaceholder;
