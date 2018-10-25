// @flow
'use strict';

export type NodeId = string;

export type Edge = {
  from: NodeId,
  to: NodeId
};

export interface Node {
  id: string;
  type?: string;
  value: any;
}

type GraphUpdates = {
  added: Graph,
  removed: Graph
};

export default class Graph {
  nodes: Map<NodeId, Node>;
  edges: Set<Edge>;

  constructor() {
    this.nodes = new Map();
    this.edges = new Set();
  }

  addNode(node: Node) {
    this.nodes.set(node.id, node);
    return node;
  }

  hasNode(id: string) {
    return this.nodes.has(id);
  }

  addEdge(edge: Edge) {
    this.edges.add(edge);
    return edge;
  }

  hasEdge(edge: Edge) {
    for (let e of this.edges) {
      if (edge.from == e.from && edge.to === e.to) {
        return true;
      }
    }

    return false;
  }

  merge(graph: Graph) {
    for (let [id, node] of graph.nodes) {
      this.addNode(node);
    }

    for (let edge of graph.edges) {
      this.addEdge(edge);
    }
  }

  // Removes node and any edges coming from that node
  removeNode(node: Node): Graph {
    let removed = new Graph();

    this.nodes.delete(node.id);
    removed.addNode(node);

    for (let edge of this.edges) {
      if (edge.from === node.id) {
        removed.merge(this.removeEdge(edge));
      }
    }

    return removed;
  }

  // Removes edge and node the edge is to if the node is orphaned
  removeEdge(edge: Edge): Graph {
    let removed = new Graph();

    this.edges.delete(edge);
    removed.addEdge(edge);

    for (let [id, node] of this.nodes) {
      if (edge.to === id) {
        if (this.isOrphanedNode(node)) {
          removed.merge(this.removeNode(node));
        }
      }
    }

    return removed;
  }

  isOrphanedNode(node: Node) {
    for (let edge of this.edges) {
      if (edge.to === node.id) {
        return false;
      }
    }
    return true;
  }

  // Update a node's downstream nodes making sure to prune any orphaned branches
  // Also keeps track of all added and removed edges and nodes
  updateDownStreamNodes(fromNode: Node, toNodes: Array<Node>): GraphUpdates {
    let removed = new Graph();
    let added = new Graph();

    let edgesBefore = Array.from(this.edges).filter(
      edge => edge.from === fromNode.id
    );
    let edgesToRemove = edgesBefore;

    for (let toNode of toNodes) {
      if (!this.nodes.has(toNode.id)) {
        this.addNode(toNode);
        added.addNode(toNode);
      }

      edgesToRemove = edgesToRemove.filter(edge => edge.to !== toNode.id);

      let edge = edgesBefore.find(edge => edge.to === toNode.id);
      if (!edge) {
        edge = {from: fromNode.id, to: toNode.id};
        this.addEdge(edge);
        added.addEdge(edge);
      }
    }

    for (let edge of edgesToRemove) {
      removed.merge(this.removeEdge(edge));
    }

    return {removed, added};
  }
}
