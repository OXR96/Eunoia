const site = (() => {
    if (location.hostname.includes('discord.com')) return 'discord';
    if (location.hostname.includes('axiom.trade')) return 'axiom';
    if (location.hostname.includes('nova.trade')) return 'nova';
    if (location.hostname.includes('photon-sol.tinyastro.io')) return 'photon';
    if (location.hostname.includes('uxento.io')) return 'uxento';
})();

function eunoia() {
    if (site === 'discord') {

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