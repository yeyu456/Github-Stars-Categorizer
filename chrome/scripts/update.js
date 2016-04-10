
const DOWNLOAD_THREAD_NUM = 5;

function _getUrl (pageNum) {
    'use strict';

    return `https://github.com/stars?direction=desc&page=${pageNum}&sort=created`;
}

function _downloadRepoList (url) {
    'use strict';

    return new new Promise(function _downloadRepo(resolve, reject) {

    });
}

function _isLastUrl (doc) {
    'use strict';

    let pagination = doc.getElementsByClassName('pagination')[0];
    if (pagination.children[1].classList.cotains('disabled')){
        return true;

    } else {
        return false;
    }
}

function _getRepoList (doc) {

}

function _onSuccess (doc) {
    'use strict';

    if (_isLastUrl(doc)) {
        isEnd = true;
        return;
    }
    repoList = repoList.concat(_getRepoList(doc));
}

function _onError (err) {
    'use strict';

    console.log(err);
}

export function update () {
    'use strict';

    let pageNum = 1;
    let isEnd = false;
    let repoList = [];

    while (!isEnd) {
        for (let i=0;i<DOWNLOAD_THREAD_NUM;i++) {
            let url = _getUrl(pageNum);
            _downloadRepoList(url).then(_onSuccess).catch(_onError);
            pageNum++;
        }
    }
}
