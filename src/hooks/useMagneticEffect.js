import { useEffect, useRef } from 'react';

export default function useMagneticEffect(strength = 20) {
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // Make sure the element has the inner wrapper
        let inner = element.querySelector('.btn-magnetic-inner');
        if (!inner) {
            // If the inner wrapper doesn't exist, we need to wrap the contents
            inner = document.createElement('span');
            inner.className = 'btn-magnetic-inner';
            while (element.firstChild) {
                inner.appendChild(element.firstChild);
            }
            element.appendChild(inner);
        }

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = element.getBoundingClientRect();
            
            // Calculate center of the button
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            
            // Calculate distance from center (values from -1 to 1)
            const distanceX = (clientX - centerX) / (width / 2);
            const distanceY = (clientY - centerY) / (height / 2);

            // Apply transform to the inner element
            // We use the inner element so the button's bounding box remains stable
            inner.style.transform = `translate(${distanceX * strength}px, ${distanceY * strength}px)`;
        };

        const handleMouseLeave = () => {
            // Reset position with a subtle spring effect via CSS transition
            inner.style.transform = `translate(0px, 0px)`;
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength]);

    return elementRef;
}
