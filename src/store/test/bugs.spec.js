import {
  addBug,
  resolveBug,
  getUnresolvedBugs,
  loadBugs,
  assignBug,
} from "../bugs";
import configureStore from "../configureStore";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe("bugSlice", () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const makeStore = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });

  describe("assign bug ", () => {
    it("to a user", async () => {
      fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);
      fakeAxios.onPatch("/bugs/1").reply(200, { id: 1, user: 1 });

      await store.dispatch(loadBugs());
      await store.dispatch(assignBug(1, 1));

      expect(store.getState().entities.bugs.list[0].userId).toEqual(1);
    });
  });

  describe("loadbugs", () => {
    it("load bugs from cache if time within 10mins", async () => {
      fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }, { id: 1 }]);

      await store.dispatch(loadBugs());
      await store.dispatch(loadBugs());
      expect(fakeAxios.history.get).toHaveLength(1);
    });

    it("should load bugs", async () => {
      fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }, { id: 1 }]);

      await store.dispatch(loadBugs());
      expect(store.getState().entities.bugs.list).toHaveLength(2);
    });

    it("should set loading to false when bugs loading failed", async () => {
      fakeAxios.onGet("/bugs").reply(500, {});

      await store.dispatch(loadBugs());
      expect(store.getState().entities.bugs.loading).toEqual(false);
    });

    it("should set loading to false when loading bugs", async () => {
      fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

      await store.dispatch(loadBugs());
      expect(store.getState().entities.bugs.loading).toEqual(false);
    });

    it("should set loading to true when loading bugs", async () => {
      fakeAxios.onGet("/bugs").reply(() => {
        expect(store.getState().entities.bugs.loading).toEqual(true);
        return [200, [{ id: 1 }]];
      });

      await store.dispatch(loadBugs());
    });
  });

  describe("addBug", () => {
    it("should add bug to store if saved to server", async () => {
      const bug = { description: "a" };
      const serverBug = { ...bug, id: 1 };
      fakeAxios.onPost("/bugs").reply(200, serverBug);

      await store.dispatch(addBug(bug));

      expect(store.getState().entities.bugs.list).toHaveLength(1);
      expect(store.getState().entities.bugs.list).toContainEqual(serverBug);
    });

    it("should not add bug to store if not saved to server", async () => {
      const bug = { description: "a" };
      fakeAxios.onPost("/bugs").reply(500);

      await store.dispatch(addBug(bug));

      expect(store.getState().entities.bugs.list).toHaveLength(0);
    });
  });

  it("should handle resolve bugs", async () => {
    fakeAxios.onPatch("/bugs/1").reply(200, { id: 1, resolved: true });
    fakeAxios.onPost("/bugs").reply(200, { id: 1 });

    await store.dispatch(addBug({}));
    await store.dispatch(resolveBug(1));

    expect(store.getState().entities.bugs.list[0].resolved).toEqual(true);
  });

  describe("selectors", () => {
    it("should get unresolved bugs", () => {
      const fakeStore = makeStore();
      fakeStore.entities.bugs.list = [
        { id: 1, resolved: true },
        { id: 1 },
        { id: 1, resolved: true },
        { id: 1 },
      ];

      const result = getUnresolvedBugs(fakeStore);

      expect(result).toHaveLength(2);
    });
  });
});
