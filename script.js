document.addEventListener("DOMContentLoaded", () => {
    const episodes = document.querySelectorAll(".episode");

    episodes.forEach((episode, index) => {
        const select = episode.querySelector("select");

        if (select.options.length === 1) {
            select.innerHTML = `
        <option value="">Select Status</option>
        <option value="watched">Watched</option>
        <option value="planned">Plan to watch</option>
        <option value="not-watched">Did not watch</option>
      `;
        }

        const savedStatus = localStorage.getItem(`episode-status-${index}`);
        if (savedStatus) {
            select.value = savedStatus;
            episode.dataset.status = savedStatus;
        }

        select.addEventListener("change", () => {
            const status = select.value;

            episode.dataset.status = "";

            if (status) {
                episode.dataset.status = status;
                localStorage.setItem(`episode-status-${index}`, status);
            } else {
                localStorage.removeItem(`episode-status-${index}`);
            }
        });
    });
});
