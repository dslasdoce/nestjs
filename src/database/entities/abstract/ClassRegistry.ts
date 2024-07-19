export default class ClassRegistry {
    private static classes: Function[] = [];

    public static registerClass = (cls: Function) => {
        // Check if class is already registered
        if (!ClassRegistry.isClassRegistered(cls)) {
            ClassRegistry.classes.push(cls);
            console.log(`Registered class: ${cls.name}`);
        }
    }

    public static isClassRegistered = (cls: Function): boolean => {
        return ClassRegistry.classes.includes(cls);
    }

    public static getRegisteredClasses = (): Function[] => {
        return ClassRegistry.classes;
    }
}