Object.getPrototypeOf = function(object){
	return 	object.constructor.prototype || object.__proto__;
};


/**
 * @constructor
 */
Class = function(){
	//create alias
	this.ns = this.namespace;
};
/**
 * @memberOf Class 
 */
Class.prototype.parent = function(arg){
	return arg.callee.prototype.__super__;
};

/**
 * @memberOf Class 
 */
Class.prototype.callParent = function(method, arg){
	return this.parent(arg)[method].apply(this, arg);
};


/**
 * @memberOf Class 
 */
Class.prototype.create = function(newClass, constructor){
	var __class__ = this.ns(newClass, constructor);
	__class__.prototype.__name__ = newClass;
	return __class__;
};

/**
 * @memberOf Class 
 */
Class.prototype.new = function() {
	var __constructor__ = this.ns(Array.prototype.shift.call(arguments));
	var __instance__ = new ((function(){}).extend(__constructor__));
	__constructor__.apply(__instance__, arguments);
	return __instance__;
};

/**
 * @memberOf Class 
 */
Class.prototype.namespace = function(ns, w){
	if (typeof ns !== 'string') {
		return ns;
	};
	var parts = ns.split("."),
		current = window
	for(var i=0; i < parts.length; i++) {
		current = current[parts[i]] = current[parts[i]] || (i == parts.length - 1?w || {}:{});
	}
	return current; 
};
/**
* @memberOf Class 
* @todo add array support
*/
Class.prototype.copy = function(o, c){
	//if o not object 
	if (o && c && typeof c == 'object') {
		for(var p in c){
			if (typeof c[p] == 'object'){
					o[p] = arguments.callee.call(this, o[p], c[p]);
			}else{
				if (typeof Object.prototype[p] == 'undefined') {	
					o[p] = c[p];
				}
			}
		}
		return o;
	}else{
		if (typeof o == 'undefined'){
			return c;
		}else{
			o[0] = c
			return o;
		}
	}
};


Class = new Class();



/**
 * @author kandy
 * @memberOf Function
 * @param baseClass
 * @returns
 */
Function.prototype.extend = function(baseClass, mix) {
	var baseClass = Class.ns(baseClass, Object);
	var cloner = function() {};
	cloner.prototype = baseClass.prototype || baseClass;
	this.prototype = new cloner();

	this.prototype.constructor = this;
	this.prototype.__super__ = baseClass.prototype || Object;
	if (baseClass.prototype) { //add allow call parent constructor
		baseClass.prototype.constructor = baseClass; 
	};
	this.mix(Class);
	this.mix(mix || {});
	return this;
};

/**
 * @author kandy
 * @memberOf Function
 * @param baseClass
 * @returns {Function} self for fluent interface
 */
Function.prototype.mix = function (object) {
	for ( var p in object) {
		switch (typeof object[p]) {
			case 'function':
				this.method(p, object[p]);
				break;
			case 'object':
				this[p] = Class.copy(this[p], object[p]);
			default:
				this[p] = object[p];
				break;
		}
	}
}

/**
 * @memberOf Function
 * @param name
 * @param func
 * @returns
 */
Function.prototype.method = function(name, func) {
	func.prototype = this.prototype;
	func.prototype.constructor = func;
	this.prototype[name] = func;
	return this;
};

