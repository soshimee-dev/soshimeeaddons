// incomplete reflection helper stuff blah blah
export default class ReflectionHelper {
	constructor(object) {
		this.object = object;
		this.class = object.getClass();
	}

	getField(name, clazz) {
		clazz = clazz || this.class;
		try {
			const field = clazz.getDeclaredField(name);
			field.setAccessible(true);
			return field.get(this.object);
		} catch (error) {
			const superclass = clazz.getSuperclass();
			if (superclass === null) return;
			return this.getField(name, superclass);
		}
	}

	setField(name, value, clazz) {
		clazz = clazz || this.class;
		try {
			const field = clazz.getDeclaredField(name);
			field.setAccessible(true);
			field.set(this.object, value);
		} catch (error) {
			const superclass = clazz.getSuperclass();
			if (superclass === null) return;
			return this.setField(name, value, superclass);
		}
	}

	getFieldNames(clazz) {
		clazz = clazz || this.class;
		const superclass = clazz.getSuperclass();
		const fields = clazz.getDeclaredFields().map(field => field.getName());
		if (superclass === null) return fields;
		return [...fields, ...this.getFieldNames(superclass)];
	}
}
