import {pages, subPackages} from "../pages.json"

// import {DeepAssign} from "@offs/uni";


export function DeepAssign(target:any, ...source: any[]) {
    function noRepeat(arr:any) {
        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                //如果相等
                if (arr[i] == arr[j]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    }

    if (target === undefined) {
        target = {};
    }
    let keys: any[] = Object.keys(target);
    for (const obj of source) {
        keys = keys.concat(Object.keys(obj));
    }
    noRepeat(keys);
    for (const key of keys) {
        let value = target[key];
        const values: any[] = [];
        if (`${typeof value}` == 'object') {
            values.push(value);
        }
        let hasObject = false;
        for (const obj of source) {
            const source_value = obj[key];
            if (typeof source_value === 'object') {
                values.push(source_value);
            }
            if (source_value !== undefined) {
                value = source_value;
            }
        }

        if (values.length > 0) {
            hasObject = true;
        }
        if (hasObject) {
            let first = values[0];
            if (values.length > 1) {
                values.slice(0, 1);
                for (const one of values) {
                    first = DeepAssign(first, one);
                }
                target[key] = first;
            } else {
                target[key] = first;
            }
        } else {
            target[key] = value;
        }
    }
    return target;
}


interface MEModuleOption {
    style?: _PageStyle,
    pagination?: _PaginationOptions
}


const defaultPagination: _PaginationOptions = {
    page_begin: 1,
    page_size: 10,
    page_index_key: 'page',
    page_size_key: 'size',
    post_encode: 'json'
}


// @ts-ignore
const defaultStyle: _PageStyle = {
    theme: 'white',
    tint: '#812726',
    fontColor: '#333333',
    backgroundColor: "#fff",
    indicatorTheme: 'gray',
    radius: '10pt',

    navigation: {
        tint: '#232323',
        background: "#f9f9f9",
        fontSize: '17px',
    },
    dialog: {
        sheetBackground: '#f1f1f1',
        alertBackground: '#ffffff',
        defaultColor: '#777777',
        cancelColor: '#cccccc',
        confirmColor: '#912f2f',
        buttonRadius: '10pt'
    },
    errorImage: {
        width: '30pt',
        height: '30pt',
        src: "/static/load-error.png"
    },
    emptyImage: {
        width: '20pt',
        height: '20pt',
        src: "/static/logo.png"
    }
}


export function injectOffsUniModule(option?: MEModuleOption) {
    const mainPages: any[] = pages
    const subPackagesList: any[] = subPackages
    const ROUTES = []
    for (const one of mainPages) {
        const name = one.name
        if (!name) {
            try {
                one.name = one.path.replaceAll(/\//g, '_').replaceAll(/[\/-]/g, '_')
            } catch (e) {
            }
        }
        ROUTES.push(one)
    }
    if (subPackagesList) {
        for (const sub of subPackagesList) {
            const root = sub.root;
            const subpages = sub.pages
            for (const subpage of subpages) {
                subpage.path = root + '/' + subpage.path
                const name = subpage.name

                if (!name) {
                    try {
                        subpage.name = subpage.path.replaceAll(/[\/-]/g, '_')
                    } catch (e) {
                    }
                }
                ROUTES.push(subpage)
            }
        }
    }
    let style = defaultStyle
    let pagination = defaultPagination
    if (option) {
        style = DeepAssign(defaultStyle, option.style || {})
        if (option.pagination) {
            pagination = option.pagination
        }
    }

    return {ROUTES: ROUTES, style: style, pagination: pagination}
}

