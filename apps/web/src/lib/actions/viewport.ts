let intersectionObserver: IntersectionObserver;

function ensureIntersectionObserver() {
    if (intersectionObserver) return;

    intersectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const eventName = entry.isIntersecting ? 'enterViewport' : 'exitViewport';
                entry.target.dispatchEvent(new CustomEvent(eventName));

                if (entry.isIntersecting) {
                    // Determine direction if not already set
                    const rect = entry.boundingClientRect;
                    const windowCenter = window.innerWidth / 2;

                    // Only set direction if no specific direction class exists
                    if (!entry.target.classList.contains('slide-from-left') &&
                        !entry.target.classList.contains('slide-from-right') &&
                        !entry.target.classList.contains('slide-from-bottom')) {

                        if (rect.left + rect.width / 2 < windowCenter) {
                            entry.target.classList.add('slide-from-left');
                        } else {
                            entry.target.classList.add('slide-from-right');
                        }
                    }

                    entry.target.classList.add('in-viewport');
                } else {
                    entry.target.classList.remove('in-viewport');
                }
            });
        },
        {
            rootMargin: "0px 0px -50px 0px", // Trigger slightly before the element is fully visible
            threshold: 0.1
        }
    );
}

export default function viewport(element: HTMLElement) {
    ensureIntersectionObserver();
    // Default starting state
    element.classList.add('animate-on-scroll');
    intersectionObserver.observe(element);

    return {
        destroy() {
            intersectionObserver.unobserve(element);
        }
    };
}
