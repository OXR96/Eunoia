const site = (() => {
    if (location.hostname.includes('discord.com')) return 'discord';
    if (location.hostname.includes('axiom.trade')) return 'axiom';
    if (location.hostname.includes('nova.trade')) return 'nova';
    if (location.hostname.includes('photon-sol.tinyastro.io')) return 'photon';
    if (location.hostname.includes('uxento.io')) return 'uxento';
})();

function createButton(tweet, images = [], platform) {
    const font = document.createElement('link');
    font.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
    font.rel = 'stylesheet';
    document.head.appendChild(font);

    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

    const button = document.createElement('button');

    button.style.all = 'initial';

    button.textContent = 'Create a coin';
    button.className = 'eunoia-button';
    button.style.fontFamily = 'Inter';

    if (platform === 'discord') {
        button.style.backgroundColor = '#45464C';
        button.style.marginLeft = '6px';
    } else if (platform === 'axiom' || platform === 'nova') {
        button.style.backgroundColor = '#45464c';
        button.style.marginTop = '5px';
        button.style.marginLeft = '0px';
    } else if (platform === 'photon') {
        button.style.backgroundColor = '#45464C';
        button.style.marginLeft = '6px';
    } else if (platform === 'uxento') {

    }

    button.style.padding = '5px 18px';

    button.style.color = '#FFFFFF';

    button.style.border = '1px solid #2E2F2F';
    button.style.borderRadius = '5px';

    button.style.fontWeight = '500';
    button.style.fontSize = '14px';

    button.style.cursor = 'pointer';
    button.style.transition = 'background-color 0.2s ease, box-shadow 0.2s ease';

    if (platform === 'discord' || platform === 'axiom' || platform === 'nova' || platform === 'photon') {
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#3E3F45';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#45464C';
        });
    } else if (platform === 'uxento') {

    }

    button.addEventListener('click', (x) => {
        x.preventDefault();
        x.stopPropagation();
    });

    return button;
}

function eunoia(root) {
    if (site === 'discord') {
        // 1s delay since the images in the embed are loaded after the embed itself and the button needs to be added after the images are loaded
        setTimeout(() => {
            const embeds = (root || document).querySelectorAll('article.embedWrapper_b7e1cb');

            embeds.forEach(embed => {
                if (embed.querySelector('.eunoia-button')) return;

                const titleURL = embed.querySelector('a.embedTitleLink__623de');
                if (!titleURL) return;

                const tweet = titleURL.getAttribute('href');
                if (!tweet) return;

                const twitter = tweet.startsWith('https://x.com/') || tweet.startsWith('https://twitter.com/');
                if (!twitter) return;

                const images = [...embed.querySelectorAll('img')]
                    .map(img => img.src)
                    .filter(src => !!src);

                const button = createButton(tweet, images, 'discord');
                titleURL.parentElement.appendChild(button);
            });
        }, 800);
    } else if (site === 'axiom') {

    } else if (site === 'nova') {

    } else if (site === 'photon') {

    } else if (site === 'uxento') {

    }
}

// // // // // // // //

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (!(node instanceof HTMLElement)) return;
            eunoia(node);
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// // // // // // // //

eunoia(document);