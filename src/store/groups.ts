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
            state.groups = [...state.groups, group];
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

        addLink(state: any, topic: any) {
            state.groups = state.groups.map((item: any) => {
                if (item.id === topic.groupId) {
                    return {
                        ...item,
                        topics: [...item.topics].map(key => {
                            if (key.id === topic.id) {
                                return {...key, links: {...key.links, [topic.linkId]: {link: topic.link, name: topic.name}}}
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
        async createGroup({commit, dispatch}: any, {title, description}: any) {
            try {
                const uid = await dispatch('getUid');
                const group = await firebase.database().ref(`/users/${uid}/groups`).push({title, description});
                commit('createGroup', {title, description, id: group.key})
            } catch (e) {
                console.log(e)
            }
        },
        async createTopic({commit, dispatch}: any, {title, text, priority, complexity, groupId}: any) {
            try {
                const uid = await dispatch('getUid');
                const topic: any = await firebase.database().ref(`/users/${uid}/groups/${groupId}/topics`).push({title, text, done: false, groupId, priority, complexity, favorite: false});
                commit('createTopic', {title, text, done: topic.done, priority, complexity, groupId, favorite: topic.favorite, id: topic.key});
            } catch (e) {
                console.log(e)
            }
        },
        async updateTopic({commit, dispatch}: any, {title, text, priority, complexity, groupId, id}: any) {
            try {
                const uid = await dispatch('getUid');
                await firebase.database().ref(`/users/${uid}/groups/${groupId}/topics`).child(id).update({title, text, priority, complexity});
                commit('updateTopic', {title, text, priority, complexity, id, groupId});
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
        async addLink({commit, dispatch}: any, {groupId, id, link, name}: any) {
            try {
                debugger
                const uid = await dispatch('getUid');
                const newLink: any = await firebase.database().ref(`/users/${uid}/groups/${groupId}/topics/${id}/links`).push({link, name});
                commit('addLink', {groupId, id, link, name, linkId: newLink.key})
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
        async deleteTopic({commit, dispatch}: any, {groupId, id}: any) {
            try {
                const uid = await dispatch('getUid');
                await firebase.database().ref(`/users/${uid}/groups/${groupId}/topics/${id}`).remove();
                commit('deleteTopic', {groupId, topicId: id})
            } catch (e) {
                console.log(e)
            }
        }
    },
    getters: {
        groups: (state: any) => state.groups
    }
}
