function hbsHelpers(exphbs) {
    return exphbs.create({
        helpers: {
            admin: user => {
                if (user.userType === 'admin') {
                    return true;
                    // return '<li class="nav-item"> <a href="/admin/customers" class="nav-link">Customer List</a> </li>';
                } else {
                    return false;
                }
            },
            customer: user => {
                if (user.userType === 'customer') {
                    return true;
                } else {
                    return false;
                }
            },
            urlTest: url => {
                if (url === '/detective') {
                    return false;
                }
                return true;
            }
        },
        defaultLayout: 'layout'
    });
}
module.exports = hbsHelpers;
