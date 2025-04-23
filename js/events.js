document.addEventListener('DOMContentLoaded', () => {
    const upcomingEventsGrid = document.getElementById('event-grid'); // Grid for upcoming
    const allPastEventsGrid = document.getElementById('all-past-events-grid'); // Slider content for past
    const meetupsGrid = document.getElementById('meetups-grid'); // Slider content for meetups
    
    const upcomingSheetUrl = 'https://opensheet.elk.sh/1gG0A6i4MlPF7fMOZEpzmrOKC_oquKvS91qB0of5NgdA/Upcoming+events';
    const pastSheetUrl = 'https://opensheet.elk.sh/1gG0A6i4MlPF7fMOZEpzmrOKC_oquKvS91qB0of5NgdA/Past+events';

    // Ensure containers are visible and clear loading text
    if (upcomingEventsGrid) {
        upcomingEventsGrid.innerHTML = '<p class="event-message">Loading upcoming events...</p>'; 
    }
    if (allPastEventsGrid) {
        allPastEventsGrid.style.display = 'flex'; 
        allPastEventsGrid.innerHTML = '<p class="event-message">Loading past events...</p>';
    }
    if (meetupsGrid) {
        meetupsGrid.style.display = 'flex';
        meetupsGrid.innerHTML = '<p class="event-message">Loading meetups...</p>';
    }

    // Helper to render events
    function renderEvents(events, container, emptyMsg, sortDesc = false) {
        let sliderId = '';
        let prevBtnId = '';
        let nextBtnId = '';

        if (container.id === 'all-past-events-grid') {
            sliderId = 'all-past-events-slider';
            prevBtnId = 'allPastEventsPrev';
            nextBtnId = 'allPastEventsNext';
        } else if (container.id === 'meetups-grid') {
            sliderId = 'meetups-slider';
            prevBtnId = 'meetupsPrev';
            nextBtnId = 'meetupsNext';
        }

        container.innerHTML = ''; 
        if (Array.isArray(events) && events.length > 0) {
            events.sort((a, b) => {
                const dateA = Date.parse(a.date);
                const dateB = Date.parse(b.date);
                if (!isNaN(dateA) && !isNaN(dateB)) return sortDesc ? dateB - dateA : dateA - dateB;
                return 0;
            });
            let rendered = false;
            events.forEach(event => {
                const hasTitle = event.title && event.title.trim().length > 0;
                const hasDesc = event.description && event.description.trim().length > 0;
                const hasDate = event.date && event.date.trim().length > 0;
                const hasImage = event.image && event.image.trim().length > 0;
                const hasLocation = event.location && event.location.trim().length > 0;
                const hasRegLink = event.registrationLink && event.registrationLink.trim().length > 0;

                if (hasTitle || hasDesc || hasDate) {
                    rendered = true;
                    const isUpcomingGrid = container.id === 'event-grid';
                    const card = document.createElement('div');
                    
                    let ratioClass = '';
                    if (hasImage) {
                        const shouldCrop = event.cropThumbnail === true || event.cropThumbnail === 'true';
                        if (event.imageRatio === '3:4') {
                            ratioClass = shouldCrop ? 'ratio-3-4-crop' : 'ratio-3-4';
                        } else {
                            const tempImg = new Image();
                            tempImg.onload = function() {
                                const aspectRatio = this.width / this.height;
                                if (aspectRatio < 0.85) {
                                    card.classList.add(shouldCrop ? 'ratio-3-4-crop' : 'ratio-3-4');
                                }
                            };
                            tempImg.src = event.image;
                        }
                    }
                    
                    card.className = isUpcomingGrid ? 
                        `content-card ${ratioClass}` : 
                        `slider-card ${ratioClass}`;
                    
                    let formattedDate = '';
                    if (hasDate) {
                        const d = new Date(event.date);
                        if (!isNaN(d.getTime())) {
                            formattedDate = d.toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            });
                        } else {
                            formattedDate = event.date;
                        }
                    }

                    const imageHtml = hasImage ? 
                        `<div class="card-image"><img src="${event.image}" alt="${hasTitle ? event.title : 'Event'}"></div>` : '';
                    
                    // --- Debugging Logs ---
                    if (isUpcomingGrid) {
                        console.log(`Upcoming Event: ${event.title}`);
                        console.log(`  Registration Link Data: '${event.registrationLink}'`);
                        console.log(`  Has Registration Link (hasRegLink): ${hasRegLink}`);
                    }
                    // --- End Debugging Logs ---

                    const registerButtonHtml = (isUpcomingGrid && hasRegLink) ? 
                        `<a href="${event.registrationLink}" target="_blank" rel="noopener noreferrer" class="register-button">Register</a>` : '';
                    
                    // --- Debugging Log ---
                    if (isUpcomingGrid) {
                        console.log(`  Generated Button HTML: ${registerButtonHtml || 'None'}`);
                    }
                    // --- End Debugging Log ---

                    const descriptionHtml = (isUpcomingGrid && hasDesc) ? 
                        `<p>${event.description}</p>` : '';

                    card.innerHTML = `
                        ${imageHtml}
                        <div class="card-content">
                            <p class="meta">${formattedDate}</p>
                            <h3>${hasTitle ? event.title : ''}</h3>
                            ${hasLocation ? `<p class="location"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>` : ''}
                            ${descriptionHtml} 
                            ${registerButtonHtml} 
                        </div>
                    `;
                    
                    if (sortDesc) {
                        container.prepend(card); 
                    } else {
                        container.appendChild(card); 
                    }
                }
            });
            if (!rendered) {
                container.innerHTML = `<p class="event-message">${emptyMsg}</p>`;
            }
            
            if (sliderId && rendered) {
                initializeSliderNavigation(sliderId, prevBtnId, nextBtnId);
            }
        } else {
            container.innerHTML = `<p class="event-message">${emptyMsg}</p>`;
        }
    }

    function initializeSliderNavigation(sliderId, prevBtnId, nextBtnId) {
        const sliderWrapper = document.getElementById(sliderId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        
        if (!sliderWrapper || !prevBtn || !nextBtn) return;
        
        const scrollAmount = 400;
        
        prevBtn.addEventListener('click', () => {
            sliderWrapper.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', () => {
            sliderWrapper.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        sliderWrapper.addEventListener('scroll', () => {
            if (sliderWrapper.scrollLeft <= 0) {
                prevBtn.style.opacity = '0.5';
            } else {
                prevBtn.style.opacity = '1';
            }
            
            if (sliderWrapper.scrollLeft + sliderWrapper.clientWidth >= sliderWrapper.scrollWidth - 10) {
                nextBtn.style.opacity = '0.5';
            } else {
                nextBtn.style.opacity = '1';
            }
        });
        
        sliderWrapper.dispatchEvent(new Event('scroll'));
    }

    // Load Upcoming Events
    if (upcomingEventsGrid) {
        console.log('Fetching upcoming events from:', upcomingSheetUrl);
        fetch(upcomingSheetUrl)
            .then(res => res.json())
            .then(events => {
                console.log('Upcoming events raw data:', events); // Check this log

                // If the fetch returns nothing or an empty array
                if (!events || events.length === 0) {
                    // Use the user-friendly message here as well
                    upcomingEventsGrid.innerHTML = '<p class="event-message">No upcoming events scheduled right now. Check back soon!</p>'; 
                    return;
                }
                
                const filtered = events.filter(event => {
                    const title = event.Event || event.event || event.title || '';
                    const description = event.Details || event.details || event.description || '';
                    const date = event.Date || event.date || '';
                    const location = event.Location || event.location || '';
                    const image = event.Image || event.image || '';
                    const registrationLink = event['Registration link'] || event.registrationLink || '';
                    
                    return (title && title.trim()) || 
                           (description && description.trim()) || 
                           (date && date.trim()) ||
                           (location && location.trim()) ||
                           (image && image.trim()) ||
                           (registrationLink && registrationLink.trim());
                });
                
                const formattedEvents = filtered.map(event => ({
                    title: event.Event || event.event || event.title || '',
                    description: event.Details || event.details || event.description || '',
                    date: event.Date || event.date || '',
                    location: event.Location || event.location || '',
                    image: event.Image || event.image || '',
                    type: event.Type || event.type || '',
                    registrationLink: event['Registration link'] || '' // Changed to match sheet 'Registration link'
                }));
                
                console.log('Reformatted upcoming events (check registrationLink):', formattedEvents); 
                // This message is used if filtering results in an empty array
                renderEvents(formattedEvents, upcomingEventsGrid, 'No upcoming events scheduled right now. Check back soon!', false); 
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                upcomingEventsGrid.innerHTML = '<p class="event-message">Could not load upcoming events. Please try again later.</p>';
            });
    }

    if (allPastEventsGrid && meetupsGrid) {
        console.log('Fetching past events from:', pastSheetUrl);
        fetch(pastSheetUrl)
            .then(res => res.json())
            .then(events => {
                console.log('Past events raw data:', events);
                
                if (!events || events.length === 0) {
                    allPastEventsGrid.innerHTML = '<p class="event-message">No past events data received.</p>';
                    meetupsGrid.innerHTML = '<p class="event-message">No meetups data received.</p>';
                    return;
                }
                
                const filtered = events.filter(event => {
                    const title = event.Event || event.event || event.title || '';
                    const description = event.Details || event.details || event.description || '';
                    const date = event.Date || event.date || '';
                    const location = event.Location || event.location || '';
                    const image = event.Image || event.image || '';
                    
                    return (title && title.trim()) || 
                           (description && description.trim()) || 
                           (date && date.trim()) ||
                           (location && location.trim()) ||
                           (image && image.trim());
                });
                
                const formattedEvents = filtered.map(event => ({
                    title: event.Event || event.event || event.title || '',
                    description: event.Details || event.details || event.description || '',
                    date: event.Date || event.date || '',
                    location: event.Location || event.location || '',
                    image: event.Image || event.image || '',
                    type: event.Type || event.type || '',
                    registrationLink: event['Registration link'] || '' // Changed to match sheet 'Registration link'
                }));
                
                console.log('Reformatted ALL past events:', formattedEvents);

                renderEvents(formattedEvents, allPastEventsGrid, 'No past events found.', true); 

                const meetupEvents = formattedEvents.filter(event => 
                    event.type && event.type.trim().toLowerCase() === 'meetup'
                );
                console.log('Filtered Meetup events:', meetupEvents);

                renderEvents(meetupEvents, meetupsGrid, 'No past meetups found.', true);

            })
            .catch(error => {
                console.error('Error fetching past events:', error);
                allPastEventsGrid.innerHTML = '<p class="event-message">Could not load past events.</p>';
                meetupsGrid.innerHTML = '<p class="event-message">Could not load meetups.</p>';
            });
    }
});
