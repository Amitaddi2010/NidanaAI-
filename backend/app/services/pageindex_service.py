from typing import List, Dict, Any, Optional

class PageIndexNode:
    def __init__(self, title: str, content: str = "", children: List['PageIndexNode'] = None):
        self.title = title
        self.content = content
        self.children = children or []

class PageIndexService:
    def __init__(self):
        # Initializing the tree with placeholder structure
        # In production, this would be built from the ingestion pipeline
        self.root = PageIndexNode("NidanaAI Guidelines", children=[
            PageIndexNode("FRI Consensus (Metsemakers 2018)", children=[
                PageIndexNode("Confirmatory Criteria", "Fistula, sinus tract, or wound breakdown..."),
                PageIndexNode("Suggestive Criteria", "Pus, redness, swelling, increased local temperature..."),
            ]),
            PageIndexNode("PJI MSIS Criteria", children=[
                PageIndexNode("Major Criteria", "Two positive periprosthetic cultures..."),
                PageIndexNode("Minor Criteria", "Elevated CRP, ESR, WBC count..."),
            ])
        ])

    def get_structure(self) -> Dict[str, Any]:
        def _node_to_dict(node: PageIndexNode) -> Dict[str, Any]:
            return {
                "title": node.title,
                "children": [_node_to_dict(child) for child in node.children]
            }
        return _node_to_dict(self.root)

    def search_tree(self, node: PageIndexNode, query: str) -> Optional[str]:
        if query.lower() in node.title.lower():
            return node.content
        for child in node.children:
            result = self.search_tree(child, query)
            if result:
                return result
        return None
