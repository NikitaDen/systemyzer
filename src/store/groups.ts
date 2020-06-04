import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app';

// Use // eslint-disable-next-line to ignore the next line.
// Use /* eslint-disable */ to ignore all warnings in a file.

Vue.use(Vuex);

export default {
    state: {
        groups: [],
    },
    mutations: {
        setGroups(state: any, groups: any) {
            state.groups = groups;
        },
        addGroup(state: any, group: any) {
            state.groups = [group, ...state.groups];
        },
        addTopic(state: any, topic: any) {
            state.groups = [...state.groups].map(item => {
                if (item.id === topic.groupId) {
                    return {
                        ...item,
                        topics: [...item.topics, {...topic, id: topic.id}]
                    }
                }
                return item
            })
        },
    },
    actions: {
        async fetchGroups({dispatch, commit}: any) {
            try {
                const uid = await dispatch('getUid');
                const groups = (await firebase.database().ref(`/users/${uid}/groups`).once('value')).val() || [];
                const normalizedGroups = Object.keys(groups).map(key => ({
                    ...groups[key],
                    id: key,
                    topics: groups[key]['topics'] ? Object.keys(groups[key]['topics']).map((item: any) => ({
                        ...groups[key]['topics'][item],
                        id: item
                    })) : [],
                }));
                commit('setGroups', normalizedGroups);

                return normalizedGroups;
            } catch (e) {
                console.log(e)
            }
        },
        async createGroup({commit, dispatch}: any, {title, description, topics = []}: any) {
            try {
                const uid = await dispatch('getUid');
                const group = await firebase.database().ref(`/users/${uid}/groups`).push({title, description, topics});
                commit('addGroup', {title, description, topics, id: group.key})
            } catch (e) {
                console.log(e)
            }
        },
        async createTopic({commit, dispatch}: any, {title, text, priority, complexity, groupId}: any) {
            try {
                const uid = await dispatch('getUid');
                const topic: any = await firebase.database().ref(`/users/${uid}/groups/${groupId}/topics`).push({title, text, done: false, priority, complexity, links: [], favorite: false});
                commit('addTopic', {title, text, done: topic.done, priority, complexity, groupId, favorite: topic.favorite, id: topic.key});
                // return {title, text, done: topic.done, priority, complexity, favorite: topic.favorite, id: topic.key}
            } catch (e) {
                console.log(e)
            }
        },
        async updateTopic({commit, dispatch}: any, {title, text, priority, complexity, groupId, id, links = []}: any) {
            try {
                const uid = await dispatch('getUid');
                await firebase.database().ref(`/users/${uid}/groups/${groupId}/topics`).child(id).update({title, text, priority, complexity, links})
            } catch (e) {
                console.log(e)
            }
        },
        async addTopicToFavorites({dispatch}: any, {groupId, id, favorite}: any) {
            try {
                const uid = await dispatch('getUid');
                await firebase.database().ref(`/users/${uid}/groups/${groupId}/topics`).child(id).update({favorite})
            } catch (e) {
                console.log(e)
            }
        },
        async deleteGroup({commit, dispatch}: any, {groupId}: any) {
            try {
                const uid = await dispatch('getUid');
                await firebase.database().ref(`/users/${uid}/groups/${groupId}`).remove();
            } catch (e) {
                console.log(e)
            }
        },
        async deleteTopic({commit, dispatch}: any, {groupId, topicId}: any) {
            try {
                const uid = await dispatch('getUid');
                await firebase.database().ref(`/users/${uid}/groups/${groupId}/topics/${topicId}`).remove();
            } catch (e) {
                console.log(e)
            }
        }
    },
    getters: {
        groups: (state: any) => state.groups
    }
}
