/**
 *
 */
function $(selector, element) {
    switch (typeof element) {
        case 'string': { var element = $(element); }; break;
        default: { var element = element && (element instanceof HTMLDocument || element instanceof Element)?element:document; }
    }
    switch (typeof selector) {
        case 'function': { $.__DocumentReady?selector.call():document.addEventListener('DOMContentLoaded',selector,false); } break;
        case 'object': { if (this instanceof $) { this.append(selector) }else{ return new $(selector);} } break;
        //case 'string': { if (/^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/.test(selector)) return new $(selector.toDom()) }
        default: { return element.$(selector); }
    }
}

(function (jQuery){
    jQuery.prototype = Array.prototype;
    jQuery.prototype.$ = jQuery;
    jQuery.prototype.length = 0;
    jQuery.prototype.find = jQuery;
    jQuery.prototype.toSource = Object.prototype.toSource;
    jQuery.prototype.append = function(elements) {
        if (elements && elements.forEach) {
            elements.forEach(function(el){this.push(el)}, this);
        }
    }

})($);

$(function(){ $.__DocumentReady = true; });

Object.prototype.forEach = Array.prototype.forEach;
HTMLDocument.prototype.$ = HTMLDocument.prototype.querySelectorAll;
HTMLDocument.DOMParser = new DOMParser();

/**
 * @return Element
 */
String.prototype.toDom = function(doc) { return (doc||document).importNode(HTMLDocument.DOMParser.parseFromString(this, "text/xml").documentElement, true);}
String.prototype.toInt = function(){return parseInt(this)}
String.prototype.toFloat = function(){return parseFloat(this)}


Element.XMLSerializer = new XMLSerializer();
Element.prototype.$ = Element.prototype.querySelectorAll;
Element.prototype.write = function(text){ this.appendChild(this.ownerDocument.createTextNode(text.toString()));}
Element.prototype.on = Element.prototype.addEventListener;
Element.prototype.bind = Element.prototype.addEventListener;
Element.prototype.attr = function(name, val){if( typeof val == 'string') { this.setAttribute(name, val); return this }else{ return this.getAttribute(name)}};
Element.prototype.toXml = function(){ return Element.XMLSerializer.serializeToString(this); };
Element.prototype.css = function(name, value){
        var name = name.replace(/[A-Z]/, function(c){return '-'+c.toString().toLowerCase()});
        if (value) {
                this.style[name] = value; return this;
        } else {
                return getComputedStyle(this, '').getPropertyValue(name)
        }
};
Element.prototype.html = function(html){
    if(typeof html == 'string'){
        this.childNodes.forEach(function(el){ this.removeChild(el) }, this);
            var el = ('<temp>'+html+'</temp>').toDom();
            while (el.firstChild) {
                    this.appendChild(el.firstChild);
            }
            return this;
    } else {
        return Array.prototype.map.call(this.childNodes, function(a){ return Element.XMLSerializer.serializeToString(a)}).join('');
    };
};
Element.prototype.text = function (text) {
    if (typeof text == 'string') {
        this.textContent = text;
        return this;
    } else {
        return this.textContent;
    }
}
//@todo use static
if (!Element.prototype.matchesSelector){
    if (Element.prototype.mozMatchesSelector) {
        Element.prototype.matchesSelector = Element.prototype.mozMatchesSelector;
    }
    if (Element.prototype.webkitMatchesSelector) {
        Element.prototype.matchesSelector = Element.prototype.webkitMatchesSelector;
    }
}
Element.prototype.is = Element.prototype.matchesSelector;
Element.prototype.data = function(key,value){
    if(value) {
        this.setUserData( key, value);
        return this
    }else{
        this.getUserData(key);
    }
}


