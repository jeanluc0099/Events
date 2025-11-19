function nettoyerEvenements() {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    const now = new Date();
    events = events.filter(e => new Date(e.date) >= now);
    localStorage.setItem('events', JSON.stringify(events));
}
nettoyerEvenements();
