import { AddClientComponent } from "../../component/AddClientComponent";

export default function EditClients({params}) {
    const { id } = params;
    return (
        <>
            <div>
                <AddClientComponent id={id} />
            </div>
        </>
    );
}
