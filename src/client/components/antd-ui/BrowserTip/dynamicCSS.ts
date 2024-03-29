/* eslint-disable */

function canUseDom() {
    return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

function contains(root, n) {
    if (!root) {
        return false;
    }

    // Use native if support
    if (root.contains) {
        return root.contains(n);
    }

    // `document.contains` not support with IE11
    var node = n;
    while (node) {
        if (node === root) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

var APPEND_ORDER = 'data-rc-order';
var MARK_KEY = 'rc-util-key';
var containerCache = new Map();
function getMark(other) {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        mark = _ref.mark;
    if (mark) {
        return mark.startsWith('data-') ? mark : 'data-'.concat(mark);
    }
    return MARK_KEY;
}
function getContainer(option) {
    if (option.attachTo) {
        return option.attachTo;
    }
    var head = document.querySelector('head');
    return head || document.body;
}
function getOrder(prepend) {
    if (prepend === 'queue') {
        return 'prependQueue';
    }
    return prepend ? 'prepend' : 'append';
}

/**
 * Find style which inject by rc-util
 */
function findStyles(container) {
    return Array.from((containerCache.get(container) || container).children).filter(function (node: any) {
        return node.tagName === 'STYLE';
    });
}
function injectCSS(css, other) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!canUseDom()) {
        return null;
    }
    var csp = option.csp,
        prepend = option.prepend;
    var styleNode = document.createElement('style');
    styleNode.setAttribute(APPEND_ORDER, getOrder(prepend));
    if (csp !== null && csp !== void 0 && csp.nonce) {
        styleNode.nonce = csp === null || csp === void 0 ? void 0 : csp.nonce;
    }
    styleNode.innerHTML = css;
    var container = getContainer(option);
    var firstChild = container.firstChild;
    if (prepend) {
        // If is queue `prepend`, it will prepend first style and then append rest style
        if (prepend === 'queue') {
            var existStyle = findStyles(container).filter(function (node: any) {
                return ['prepend', 'prependQueue'].includes(node.getAttribute(APPEND_ORDER));
            }) as any;
            if (existStyle.length) {
                container.insertBefore(styleNode, existStyle[existStyle.length - 1].nextSibling);
                return styleNode;
            }
        }

        // Use `insertBefore` as `prepend`
        container.insertBefore(styleNode, firstChild);
    } else {
        container.appendChild(styleNode);
    }
    return styleNode;
}
function findExistNode(key, other) {
    var option: any = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var container = getContainer(option);
    return findStyles(container).find(function (node: any) {
        return node.getAttribute(getMark(option)) === key;
    });
}

/**
 * qiankun will inject `appendChild` to insert into other
 */
function syncRealContainer(container, option) {
    var cachedRealContainer = containerCache.get(container);

    // Find real container when not cached or cached container removed
    if (!cachedRealContainer || !contains(document, cachedRealContainer)) {
        var placeholderStyle = injectCSS('', option);
        if (!placeholderStyle) {
            return;
        }
        var parentNode = placeholderStyle.parentNode;
        containerCache.set(container, parentNode);
        container.removeChild(placeholderStyle);
    }
}

/**
 * manually clear container cache to avoid global cache in unit testes
 */
function clearContainerCache() {
    containerCache.clear();
}

export function removeCSS(key) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var existNode = findExistNode(key, option);
    if (existNode) {
        var container = getContainer(option);
        container.removeChild(existNode);
    }
}

export function updateCSS(css, key) {
    var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var container = getContainer(option);

    // Sync real parent
    syncRealContainer(container, option);
    var existNode: any = findExistNode(key, option);
    if (existNode) {
        var _option$csp, _option$csp2;
        if (
            (_option$csp = option.csp) !== null &&
            _option$csp !== void 0 &&
            _option$csp.nonce &&
            existNode.nonce !==
                ((_option$csp2 = option.csp) === null || _option$csp2 === void 0 ? void 0 : _option$csp2.nonce)
        ) {
            var _option$csp3;
            existNode.nonce =
                (_option$csp3 = option.csp) === null || _option$csp3 === void 0 ? void 0 : _option$csp3.nonce;
        }
        if (existNode.innerHTML !== css) {
            existNode.innerHTML = css;
        }
        return existNode;
    }
    var newNode: any = injectCSS(css, option);
    newNode.setAttribute(getMark(option), key);
    return newNode;
}
