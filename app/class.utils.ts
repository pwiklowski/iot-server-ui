
export class ClassUtils{

    static hasClass(el, className) {
      if (el.classList)
        return el.classList.contains(className)
      else
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    }

    static addClass(el, className) {
        if (el.classList)
            el.classList.add(className)
        else if (!ClassUtils.hasClass(el, className)) 
            el.className += " " + className
    }

    static removeClass(el, className) {
      if (el.classList)
        el.classList.remove(className)
      else if (ClassUtils.hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
        el.className=el.className.replace(reg, ' ')
      }
    }

}
