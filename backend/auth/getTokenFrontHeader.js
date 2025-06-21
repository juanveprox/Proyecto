function getTokenFrontHeader(header) {
    if (header && header.authorization) {
        const parts = header.authorization.split(' ');
        if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
            return parts[1];
        } else {
            return null
        }
    } else {
        return null
    }

}


module.exports = getTokenFrontHeader;