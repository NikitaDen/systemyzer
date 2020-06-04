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
        createGroup(state: any, group: any) {
            state.groups = [group, ...state.groups];
        },
        deleteGroup(state: any, group: any) {
            state.groups = [...state.groups].filter(item => item.id !== group.groupId);
        },
        createTopic(state: any, topic: any) {
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
        editParticularFeature(state: any, topic: any) {
            state.groups = state.groups.map((item: any) => {
                if (item.id === topic.groupId) {
                    return {
                        ...item,
                        topics: [...item.topics].map(key => {
                            if (key.id === topic.id) {
                                return {...key, [topic.feature]: topic[topic.feature]}
                            }
                            return key;
                        })
                    }
                }
                return item
            });
        },
        deleteTopic(state: any, topic: any) {
            state.groups = [...state.groups].map(item => {
                if (item.id === topic.groupId) {
                    return {
                        ...item,
                        topics: [...item.topics].filter(key => key.id !== topic.topicId)
                    }
                }
                return item
            });
        },
        updateTopic(state: any, topic: any) {
            state.groups = [...state.groups].map(item => {
                if (item.id === topic.groupId) {
                    return {
                        ...item,
                        topics: [...item.topics].map(key => {
                            if (key.id === topic.id) {
                                return {...key, ...topic}
                            }
                            return key;
                        })
                    }
                }
                return item
            });
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
                commit('createGroup', {title, description, topics, id: group.key})
            } catch (e) {
                console.log(e)
            }
        },
        async createTopic({commit, dispatch}: any, {title, text, priority, complexity, groupId}: any) {
            try {
                const uid = await dispatch('getUid');
                const topic: any = await firebase.database().ref(`/users/${uid}/groups/${groupId}/topics`).push({title, text, done: false, groupId, priority, complexity, links: [], favorite: false});
                commit('createTopic', {title, text, done: topic.done, priority, complexity, groupId, favorite: topic.favorite, id: topic.key});
            } catch (e) {
                console.log(e)
            }
        },
        async updateTopic({commit, dispatch}: any, {title, text, priority, complexity, groupId, id, links = []}: any) {
            try {
                const uid = await dispatch('getUid');
                await firebase.database().ref(`/users/${uid}/groups/${groupId}/topics`).child(id).update({title, text, priority, complexity, links});
                commit('updateTopic', {title, text, priority, complexity, links, id, groupId});
            } catch (e) {
                console.log(e)
            }
        },
        async addTopicToFavorites({commit, dispatch}: any, {groupId, id, favorite}: any) {
            try {
                const uid = await dispatch('getUid');
                await firebase.database().ref(`/users/${uid}/groups/${groupId}/topics`).child(id).update({favorite});
                commit('editParticularFeature', {groupId, id, favorite, feature: 'favorite'})
            } catch (e) {
                console.log(e)
            }
        },
        async setTopicDone({commit, dispatch}: any, {groupId, id, done}: any) {
            try {
                const uid = await dispatch('getUid');
                await firebase.database().ref(`/users/${uid}/groups/${groupId}/topics`).child(id).update({done});
                commit('editParticularFeature', {groupId, id, done, feature: 'done'})
            } catch (e) {
                console.log(e)
            }
        },
        async deleteGroup({commit, dispatch}: any, {groupId}: any) {
            try {
                const uid = await dispatch('getUid');
                await firebase.database().ref(`/users/${uid}/groups/${groupId}`).remove();
                commit('deleteGroup', {groupId});
            } catch (e) {
                console.log(e)
            }
        },
        async deleteTopic({commit, dispatch}: any, {groupId, topicId}: any) {
            try {
                const uid = await dispatch('getUid');
                await firebase.database().ref(`/users/${uid}/groups/${groupId}/topics/${topicId}`).remove();
                commit('deleteTopic', {groupId, topicId})
            } catch (e) {
                console.log(e)
            }
        }
    },
    getters: {
        groups: (state: any) => state.groups
    }
}
