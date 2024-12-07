// @ts-ignore
const defaultPagination: _PaginationOptions = {
    page_begin: 1,
    page_size: 10,
    page_index_key: 'page',
    page_size_key: 'pagesize',
    post_encode: 'json'
}



// @ts-ignore
const defaultStyle: _PageStyle = {
    theme: 'white',
    tint: '#10D4C0',
    backgroundColor: "#f8f8f8",
    indicatorTheme: 'gray',
    fontColor: '#333333',
    radius: '10px',
    errorImage: {
        width: '280rpx',
        height: '280rpx',
        src: "/static/box-error.png"
    },
    emptyImage: {
        width: '240rpx',
        height: '240rpx',
        src: "/static/box-empry.png"
    },
    navigation: {
        tint: '#232323',
        background: '#f8f8f8',
        fontSize: '17px'
    },
    dialog: {
        cancelColor: '#aaaaaa',
        confirmColor: 'tint',
        defaultColor: '#333333',
        buttonRadius: '10rpx',
        sheetBackground: '#ffffff',
        alertBackground: '#ffffff'
    },
}

export default {
    style: defaultStyle,
    pagination: defaultPagination
}
