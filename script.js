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

        select.addEventListener("change", async () => {
            const status = select.value;

            episode.dataset.status = "";

            if (status) {
                episode.dataset.status = status;
                localStorage.setItem(`episode-status-${index}`, status);

                try {
                    const permissionGranted =
                        await NotificationService.requestPermission();

                    if (permissionGranted) {
                        const episodeTitle =
                            episode.querySelector("h4")?.textContent ??
                            "Episode";

                        NotificationService.notify("Episode status updated", {
                            body: `${episodeTitle}: ${status.replace(
                                "-",
                                " "
                            )}`,
                            silent: true,
                        });
                    }
                } catch (error) {
                    console.error("Failed to send a notification:", error);
                }
            } else {
                localStorage.removeItem(`episode-status-${index}`);
            }
        });
    });
});

const NotificationService = {
    isSupported() {
        return "Notification" in window;
    },

    async requestPermission() {
        if (!this.isSupported()) return false;

        if (Notification.permission === "granted") return true;

        if (Notification.permission === "denied") return false;

        try {
            const permission = await Notification.requestPermission();
            return permission === "granted";
        } catch (error) {
            console.error(
                "Please gtant permissions to send notifications:",
                error
            );
            return false;
        }
    },

    notify(title, options) {
        if (!this.isSupported()) return;

        if (Notification.permission !== "granted") return;

        try {
            new Notification(title, options);
        } catch (error) {
            console.error("Notification error:", error);
        }
    },
};
