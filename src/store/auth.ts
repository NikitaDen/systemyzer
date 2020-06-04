import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app';

// Use // eslint-disable-next-line to ignore the next line.
// Use /* eslint-disable */ to ignore all warnings in a file.

Vue.use(Vuex);

export default {
    state: {},
    mutations: {},
    actions: {
        async login({dispatch, commit}: any, {email, password}: any) {
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password);
                const uid = await dispatch('getUid');
                const info = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val()
                console.log(info);
                commit('setInfo', info)
            } catch (e) {
                console.log(e);
            }
        },
        async register({dispatch}: any, {name, surname, email, password}: any) {
            await firebase.auth().createUserWithEmailAndPassword(email, password);
            const uid = await dispatch('getUid');
            await firebase.database().ref(`/users/${uid}/info`).set({
                name, surname
            })
        },
        getUid() {
            const user = firebase.auth().currentUser;
            return user ? user.uid : null;
        },
        async logout() {
            await firebase.auth().signOut()
        }
    },
    modules: {}
}
