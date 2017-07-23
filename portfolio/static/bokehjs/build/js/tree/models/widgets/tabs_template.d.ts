export interface TabsProps {
    tabs: Array<{
        id: string;
        title: string;
    }>;
    active_tab_id: string;
}
declare const _default: (props: TabsProps) => HTMLElement;
export default _default;
