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

        createForm(tweet, [...images]);
    });

    return button;
}

function createForm(tweet, images = []) {
    const existingPopup = document.getElementById('eunoia-popup');
    if (existingPopup) {
        document.body.removeChild(existingPopup);
    }

    const popup = document.createElement('div');
    popup.id = 'eunoia-popup';
    popup.style.position = 'fixed';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100%';
    popup.style.height = '100%';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    popup.style.display = 'flex';
    popup.style.justifyContent = 'center';
    popup.style.alignItems = 'center';
    popup.style.zIndex = '999999';
    popup.style.opacity = '0';
    popup.style.transition = 'opacity 0.3s ease';
    popup.style.fontFamily = '\'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif';

    const formContainer = document.createElement('div');
    formContainer.style.width = '100%';
    formContainer.style.maxWidth = '448px';
    formContainer.style.backgroundColor = '#171717';
    formContainer.style.border = '1px solid #2e2f2f';
    formContainer.style.borderRadius = '14px';
    formContainer.style.overflow = 'hidden';
    formContainer.style.transform = 'translateY(20px)';
    formContainer.style.transition = 'transform 0.3s ease';

    const header = document.createElement('div');
    header.style.padding = '24px 24px 16px';
    header.style.textAlign = 'center';

    const title = document.createElement('h2');
    title.textContent = 'Eunoia';
    title.style.margin = '0';
    title.style.fontSize = '20px';
    title.style.fontWeight = '600';
    title.style.color = 'white';
    title.style.lineHeight = '1.2';

    const description = document.createElement('p');
    description.textContent = 'Create and launch a token on pump.fun';
    description.style.margin = '8px 0 0';
    description.style.fontSize = '14px';
    description.style.color = '#9ca3af';
    description.style.lineHeight = '1.4';

    header.appendChild(title);
    header.appendChild(description);

    const content = document.createElement('div');
    content.style.padding = '0 24px 24px';

    const form = document.createElement('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        closeForm();
    });

    if (images && images.length > 0) {
        const imageSection = document.createElement('div');
        imageSection.style.marginBottom = '24px';

        const imageLabel = document.createElement('label');
        imageLabel.textContent = 'Image';
        imageLabel.style.display = 'block';
        imageLabel.style.marginBottom = '8px';
        imageLabel.style.color = 'white';
        imageLabel.style.fontSize = '14px';
        imageLabel.style.fontWeight = '500';

        const imageGrid = document.createElement('div');
        imageGrid.style.display = 'grid';
        imageGrid.style.gridTemplateColumns = `repeat(${Math.min(images.length + 1, 4)}, 1fr)`;
        imageGrid.style.gap = '12px';

        images.forEach((imageSrc, index) => {
            const imageBox = document.createElement('div');
            imageBox.style.position = 'relative';
            imageBox.style.aspectRatio = '1';
            imageBox.style.borderRadius = '8px';
            imageBox.style.border = '2px solid #2e2f2f';
            imageBox.style.overflow = 'hidden';
            imageBox.style.cursor = 'pointer';
            imageBox.style.transition = 'border-color 0.2s ease';

            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `Image ${index + 1}`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';

            imageBox.appendChild(img);
            imageBox.addEventListener('click', () => {
                document.querySelectorAll('#eunoia-popup .image-box').forEach((box) => {
                    box.style.border = '2px solid #2e2f2f';
                });
                imageBox.style.border = '2px solid white';
                imageBox.setAttribute('data-selected', 'true');
            });
            imageBox.classList.add('image-box');

            if (index === 0) {
                imageBox.style.border = '2px solid white';
                imageBox.setAttribute('data-selected', 'true');
            }

            imageGrid.appendChild(imageBox);
        });

        const uploadBox = document.createElement('label');
        uploadBox.style.position = 'relative';
        uploadBox.style.aspectRatio = '1';
        uploadBox.style.borderRadius = '8px';
        uploadBox.style.border = '2px dashed #2e2f2f';
        uploadBox.style.display = 'flex';
        uploadBox.style.flexDirection = 'column';
        uploadBox.style.alignItems = 'center';
        uploadBox.style.justifyContent = 'center';
        uploadBox.style.backgroundColor = '#1a1a1a';
        uploadBox.style.cursor = 'pointer';
        uploadBox.style.transition = 'border-color 0.2s ease';

        uploadBox.addEventListener('mouseenter', () => {
            uploadBox.style.borderColor = '#4a5568';
        });

        uploadBox.addEventListener('mouseleave', () => {
            uploadBox.style.borderColor = '#2e2f2f';
        });

        const uploadIcon = document.createElement('div');
        uploadIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        `;
        uploadIcon.style.color = '#9ca3af';
        uploadIcon.style.marginBottom = '4px';

        const uploadText = document.createElement('span');
        uploadText.textContent = 'Upload';
        uploadText.style.fontSize = '12px';
        uploadText.style.color = '#9ca3af';
        uploadText.style.fontWeight = '500';

        const uploadInput = document.createElement('input');
        uploadInput.type = 'file';
        uploadInput.accept = 'image/*';
        uploadInput.style.position = 'absolute';
        uploadInput.style.inset = '0';
        uploadInput.style.opacity = '0';
        uploadInput.style.cursor = 'pointer';

        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.querySelectorAll('#eunoia-popup .image-box').forEach((box) => {
                        box.style.border = '2px solid #2e2f2f';
                        box.removeAttribute('data-selected');
                    });

                    const newImageBox = document.createElement('div');
                    newImageBox.style.position = 'relative';
                    newImageBox.style.aspectRatio = '1';
                    newImageBox.style.borderRadius = '8px';
                    newImageBox.style.border = '2px solid white';
                    newImageBox.style.overflow = 'hidden';
                    newImageBox.style.cursor = 'pointer';
                    newImageBox.classList.add('image-box');
                    newImageBox.setAttribute('data-selected', 'true');

                    const newImg = document.createElement('img');
                    newImg.src = event.target.result;
                    newImg.style.width = '100%';
                    newImg.style.height = '100%';
                    newImg.style.objectFit = 'cover';

                    newImageBox.appendChild(newImg);

                    uploadBox.style.display = 'none';
                    imageGrid.appendChild(newImageBox);
                };
                reader.readAsDataURL(file);
            }
        });

        uploadBox.appendChild(uploadIcon);
        uploadBox.appendChild(uploadText);
        uploadBox.appendChild(uploadInput);
        imageGrid.appendChild(uploadBox);

        imageSection.appendChild(imageLabel);
        imageSection.appendChild(imageGrid);
        form.appendChild(imageSection);
    }

    const nameTickerGrid = document.createElement('div');
    nameTickerGrid.style.display = 'grid';
    nameTickerGrid.style.gridTemplateColumns = '1fr 1fr';
    nameTickerGrid.style.gap = '16px';
    nameTickerGrid.style.marginBottom = '24px';

    const nameGroup = document.createElement('div');
    nameGroup.style.display = 'grid';
    nameGroup.style.gap = '8px';

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name';
    nameLabel.style.color = 'white';
    nameLabel.style.fontSize = '14px';
    nameLabel.style.fontWeight = '500';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.required = true;
    nameInput.maxLength = 30;
    nameInput.style.width = '100%';
    nameInput.style.padding = '10px 12px';
    nameInput.style.backgroundColor = '#171717';
    nameInput.style.border = '1px solid #2e2f2f';
    nameInput.style.borderRadius = '6px';
    nameInput.style.color = 'white';
    nameInput.style.fontSize = '14px';
    nameInput.style.outline = 'none';
    nameInput.style.fontFamily = 'inherit';
    nameInput.style.boxSizing = 'border-box';

    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);

    const tickerGroup = document.createElement('div');
    tickerGroup.style.display = 'grid';
    tickerGroup.style.gap = '8px';

    const tickerLabel = document.createElement('label');
    tickerLabel.textContent = 'Ticker';
    tickerLabel.style.color = 'white';
    tickerLabel.style.fontSize = '14px';
    tickerLabel.style.fontWeight = '500';

    const tickerWrapper = document.createElement('div');
    tickerWrapper.style.position = 'relative';

    const tickerPrefix = document.createElement('span');
    tickerPrefix.textContent = '$';
    tickerPrefix.style.position = 'absolute';
    tickerPrefix.style.left = '12px';
    tickerPrefix.style.top = '50%';
    tickerPrefix.style.transform = 'translateY(-50%)';
    tickerPrefix.style.color = '#9ca3af';
    tickerPrefix.style.pointerEvents = 'none';
    tickerPrefix.style.userSelect = 'none';
    tickerPrefix.style.fontSize = '14px';

    const tickerInput = document.createElement('input');
    tickerInput.type = 'text';
    tickerInput.required = true;
    tickerInput.maxLength = 10;
    tickerInput.style.width = '100%';
    tickerInput.style.padding = '10px 12px 10px 28px';
    tickerInput.style.backgroundColor = '#171717';
    tickerInput.style.border = '1px solid #2e2f2f';
    tickerInput.style.borderRadius = '6px';
    tickerInput.style.color = 'white';
    tickerInput.style.fontSize = '14px';
    tickerInput.style.outline = 'none';
    tickerInput.style.fontFamily = 'inherit';
    tickerInput.style.boxSizing = 'border-box';

    tickerWrapper.appendChild(tickerPrefix);
    tickerWrapper.appendChild(tickerInput);
    tickerGroup.appendChild(tickerLabel);
    tickerGroup.appendChild(tickerWrapper);

    nameTickerGrid.appendChild(nameGroup);
    nameTickerGrid.appendChild(tickerGroup);

    const tweetGroup = document.createElement('div');
    tweetGroup.style.display = 'grid';
    tweetGroup.style.gap = '8px';
    tweetGroup.style.marginBottom = '24px';

    const tweetLabel = document.createElement('label');
    tweetLabel.textContent = 'Tweet';
    tweetLabel.style.color = 'white';
    tweetLabel.style.fontSize = '14px';
    tweetLabel.style.fontWeight = '500';

    const tweetInput = document.createElement('input');
    tweetInput.type = 'url';
    tweetInput.required = true;
    tweetInput.style.width = '100%';
    tweetInput.style.padding = '10px 12px';
    tweetInput.style.backgroundColor = '#171717';
    tweetInput.style.border = '1px solid #2e2f2f';
    tweetInput.style.borderRadius = '6px';
    tweetInput.style.color = 'white';
    tweetInput.style.fontSize = '14px';
    tweetInput.style.outline = 'none';
    tweetInput.style.fontFamily = 'inherit';
    tweetInput.style.boxSizing = 'border-box';

    tweetGroup.appendChild(tweetLabel);
    tweetGroup.appendChild(tweetInput);

    const websiteGroup = document.createElement('div');
    websiteGroup.style.display = 'grid';
    websiteGroup.style.gap = '8px';
    websiteGroup.style.marginBottom = '24px';

    const websiteLabel = document.createElement('label');
    websiteLabel.textContent = 'Website';
    websiteLabel.style.color = 'white';
    websiteLabel.style.fontSize = '14px';
    websiteLabel.style.fontWeight = '500';

    const websiteInput = document.createElement('input');
    websiteInput.type = 'url';
    websiteInput.style.width = '100%';
    websiteInput.style.padding = '10px 12px';
    websiteInput.style.backgroundColor = '#171717';
    websiteInput.style.border = '1px solid #2e2f2f';
    websiteInput.style.borderRadius = '6px';
    websiteInput.style.color = 'white';
    websiteInput.style.fontSize = '14px';
    websiteInput.style.outline = 'none';
    websiteInput.style.fontFamily = 'inherit';
    websiteInput.style.boxSizing = 'border-box';

    websiteGroup.appendChild(websiteLabel);
    websiteGroup.appendChild(websiteInput);

    const actionGroup = document.createElement('div');
    actionGroup.style.display = 'flex';
    actionGroup.style.gap = '12px';

    const solWrapper = document.createElement('div');
    solWrapper.style.position = 'relative';
    solWrapper.style.flex = '2';

    const solIcon = document.createElement('div');
    solIcon.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 397.7 311.7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 237.9z" fill="url(#paint0_linear)"/>
            <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1L333.1 73.8c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#paint1_linear)"/>
            <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#paint2_linear)"/>
            <defs>
                <linearGradient id="paint0_linear" x1="360.8" y1="351.4" x2="141.4" y2="132.0" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#00FFA3"/>
                    <stop offset="1" stop-color="#DC1FFF"/>
                </linearGradient>
                <linearGradient id="paint1_linear" x1="264.8" y1="77.6" x2="45.4" y2="-141.8" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#00FFA3"/>
                    <stop offset="1" stop-color="#DC1FFF"/>
                </linearGradient>
                <linearGradient id="paint2_linear" x1="312.5" y1="214.5" x2="93.1" y2="-4.9" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#00FFA3"/>
                    <stop offset="1" stop-color="#DC1FFF"/>
                </linearGradient>
            </defs>
        </svg>
    `;
    solIcon.style.position = 'absolute';
    solIcon.style.left = '12px';
    solIcon.style.top = '50%';
    solIcon.style.transform = 'translateY(-50%)';
    solIcon.style.pointerEvents = 'none';
    solIcon.style.display = 'flex';
    solIcon.style.alignItems = 'center';
    solIcon.style.justifyContent = 'center';
    solIcon.style.height = '16px';

    const solInput = document.createElement('input');
    solInput.type = 'text';
    solInput.placeholder = '1';
    solInput.style.width = '100%';
    solInput.style.padding = '10px 12px 10px 36px';
    solInput.style.backgroundColor = '#171717';
    solInput.style.border = '1px solid #2e2f2f';
    solInput.style.borderRadius = '6px';
    solInput.style.color = 'white';
    solInput.style.fontSize = '14px';
    solInput.style.outline = 'none';
    solInput.style.fontFamily = 'inherit';
    solInput.style.boxSizing = 'border-box';
    solInput.style.lineHeight = "1";
    solInput.style.height = '40px';
    solInput.style.display = 'flex';
    solInput.style.alignItems = 'center';

    solInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
        const parts = e.target.value.split('.');

        if (parts.length > 2) {
            e.target.value = parts[0] + "." + parts.slice(1).join(';')
        }
    });

    solWrapper.appendChild(solIcon);
    solWrapper.appendChild(solInput);

    const launchButton = document.createElement('button');
    launchButton.type = 'submit';
    launchButton.textContent = 'Create token';
    launchButton.style.flex = '3';
    launchButton.style.padding = '10px 16px';
    launchButton.style.backgroundColor = 'white';
    launchButton.style.color = 'black';
    launchButton.style.border = 'none';
    launchButton.style.borderRadius = '6px';
    launchButton.style.fontSize = '14px';
    launchButton.style.fontWeight = '500';
    launchButton.style.cursor = 'pointer';
    launchButton.style.transition = 'background-color 0.2s ease';
    launchButton.style.fontFamily = 'inherit';

    launchButton.addEventListener('mouseenter', () => {
        launchButton.style.backgroundColor = '#e5e5e5';
    });

    launchButton.addEventListener('mouseleave', () => {
        launchButton.style.backgroundColor = 'white';
    });

    actionGroup.appendChild(solWrapper);
    actionGroup.appendChild(launchButton);

    form.appendChild(nameTickerGrid);
    form.appendChild(tweetGroup);
    form.appendChild(websiteGroup);
    form.appendChild(actionGroup);

    content.appendChild(form);

    formContainer.appendChild(header);
    formContainer.appendChild(content);

    popup.appendChild(formContainer);

    document.body.appendChild(popup);

    const style = document.createElement('style');
    style.textContent = `
        #eunoia-popup input:focus {
            border-color: #4a5568 !important;
        }
        #eunoia-popup .image-box:hover {
            border-color: #4a5568 !important;
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        popup.style.opacity = '1';
        formContainer.style.transform = 'translateY(0)';
    }, 10);

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closeForm();
        }
    });

    function closeForm() {
        popup.style.opacity = '0';
        formContainer.style.transform = 'translateY(20px)';
        setTimeout(() => {
            if (document.body.contains(popup)) {
                document.body.removeChild(popup);
            }
        }, 300);
    }

    if (tweetInput && tweet) {
        tweetInput.value = tweet;
    }

    return popup;
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
        const posts = (root || document).querySelectorAll('div[role="button"].cursor-pointer.block.border-b');

        posts.forEach(post => {
            if (post.querySelector('.eunoia-button')) return;

            const tracker = post.querySelector('div.flex-1.min-w-0');
            if (!tracker) return;

            const tweet = post.querySelector('a[href*="x.com"], a[href*="truthsocial.com"]')?.getAttribute('href') || location.href;
            const images = [...post.querySelectorAll('img')]
                .map(img => img.src)
                .filter(src => !!src);

            const button = createButton(tweet, images, 'axiom');
            tracker.appendChild(button);
        });
    } else if (site === 'nova') {
        const posts = (root || document).querySelectorAll('a.flex.w-full.rounded-\\\[8px\\\].border');

        posts.forEach(post => {
            if (post.querySelector('.eunoia-button')) return;

            const tracker = post.querySelector('div.flex.w-full.flex-col p');
            if (!tracker) return;

            const postLink = post.getAttribute('href') || location.href;
            const images = [...post.querySelectorAll('img')]
                .map(img => img.src)
                .filter(src => !!src);

            const button = createButton(postLink, images, 'nova');

            tracker.appendChild(button);
        });
    } else if (site === 'photon') {
        const posts = (root || document).querySelectorAll('div.react-tweet-theme article');

        posts.forEach(post => {
            if (post.querySelector('.eunoia-button')) return;

            const feed = post.querySelector('div > p');
            if (!feed) return;

            const tweet = post.querySelector('a[href*="twitter.com"]')?.getAttribute('href') || location.href;
            const images = [...post.querySelectorAll('img')]
                .map(img => img.src)
                .filter(src => !!src);

            const button = createButton(tweet, images, 'photon');
            feed.appendChild(button);
        });
    } else if (site === 'uxento') {

    }
}

// // // // // // // //

if (site === 'axiom') {
    let latestPair = null;

    setInterval(() => {
        const path = window.location.pathname.split('/');

        if (path[1] !== 'meme') return;

        if (path[2] && path[2] !== latestPair) {
            latestPair = path[2];

            fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${path[2]}`).then(response => {
                return response.json();
            }).then(data => {
                const tokenAddress = data.pairs?.[0]?.baseToken?.address;

                const referer = {
                    value: 'oxr',
                    expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
                };

                const tokenReferer = {
                    value: {
                        tokenAddress: tokenAddress,
                        referrer: 'oxr'
                    },
                    expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
                };

                localStorage.setItem('referrer', JSON.stringify(referer));
                localStorage.setItem('referredToken', JSON.stringify(tokenReferer));
            }).catch(error => {
                console.error(error);
            });
        }
    }, 1000);

    // // //

    function enforceReferrer() {
        const referrerKey = 'referrer';
        const tokenReferrerKey = 'referredToken';
        const expectedValue = 'oxr';

        const storedReferrer = localStorage.getItem(referrerKey);
        if (storedReferrer) {
            const parsedReferrer = JSON.parse(storedReferrer);

            if (parsedReferrer.value !== expectedValue) {
                const referer = {
                    value: expectedValue,
                    expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
                };

                localStorage.setItem(referrerKey, JSON.stringify(referer));
            }
        }

        const storedTokenReferrer = localStorage.getItem(tokenReferrerKey);
        if (storedTokenReferrer) {
            const parsedTokenReferrer = JSON.parse(storedTokenReferrer);
            
            if (parsedTokenReferrer.value.referrer !== expectedValue) {
                parsedTokenReferrer.value.referrer = expectedValue;
                parsedTokenReferrer.expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000);

                localStorage.setItem(tokenReferrerKey, JSON.stringify(parsedTokenReferrer));
            }
        }
    }

    window.addEventListener('storage', (event) => {
        if (event.key === 'referrer' || event.key === 'referredToken') {
            enforceReferrer();
        }
    });

    setInterval(enforceReferrer, 10);
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