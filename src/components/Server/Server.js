import {xFetch} from './xFetch';

export async function getQiNiuToken() {
    return xFetch('/api/token/qiniu');
}
export async function login(user) {
    return xFetch(
        '/api/token',
        {
            method: 'POST',
            body: JSON.stringify(user)
        },
    );
}
export async function getSuperData() {
    return xFetch('/api/superRp');
}
export async function getHourData() {
    return xFetch('/api/hourRpSetting');
}
export async function getBlessData() {
    return xFetch('/api/blessRp');
}


export async function postSuperData(data) {
    return xFetch(
        '/api/superRp',
        {
            method: 'POST',
            body: JSON.stringify(data)
        },
    );
}

export async function postBlessData(data) {
    return xFetch(
        '/api/blessRp',
        {
            method: 'POST',
            body: JSON.stringify(data)
        },
    );
}

export async function putBlessData(id,data) {
    return xFetch(
        `/api/blessRp/${id}`,
        {
            method: 'PUT',
            body: JSON.stringify(data)
        },
    );
}

export async function getSingleSuperData(data) {
    return xFetch(`/api/superRp/${data}`);
}

export async function putSingleSuperData(id,data) {
    return xFetch(
        `/api/superRp/${id}`,
        {
            method: 'PUT',
            body: JSON.stringify(data)
        },
    );
}

export async function delSingleSuperData(id) {
    return xFetch(
        `/api/superRp/${id}`,
        {
            method: 'DELETE'
        },
    );
}

export async function delSingleBlessData(id) {
    return xFetch(
        `/api/blessRp/${id}`,
        {
            method: 'DELETE'
        },
    );
}

export async function postDataImg(data) {
    return xFetch(
        '/api/cloudImage',
        {
            method: 'POST',
            body: JSON.stringify(data)
        },
    );
}
export async function changeDataImg(data) {
    return xFetch(
        '/api/cloudImage',
        {
            method: 'PUT',
            body: JSON.stringify(data)
        },
    );
}
export async function getSingleDataImg(data) {
    return xFetch(`/api/cloudImage/${data}`);
}
export async function delSingleDataImg(id) {
    return xFetch(
        `/api/cloudImage/${id}`,
        {
            method: 'DELETE'
        },
    );
}
