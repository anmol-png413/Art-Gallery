import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { fetchArtworks } from "../api/api";
import { Button } from "primereact/button";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string | null;
  Year_start: number;
  Year_end: number;
}

const ArtTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showPanelMobile, setShowPanelMobile] = useState(false);
  const rowsPerPage = 12;

  const loadArtworks = async (pageNumber: number) => {
    const data = await fetchArtworks(pageNumber, rowsPerPage);
    if (data) {
      setArtworks(data.data);
      setTotalRecords(data.pagination.total);
    }
  };

  useEffect(() => {
    loadArtworks(page);
  }, [page]);

  const onSelectionChange = (e: any) => {
    const newSelection = e.value;
    const otherPagesSelection = selectedArtworks.filter(
      (art) => !artworks.some((a) => a.id === art.id)
    );
    setSelectedArtworks([...otherPagesSelection, ...newSelection]);
  };

  const removeFromSelection = (id: number) => {
    setSelectedArtworks(selectedArtworks.filter((art) => art.id !== id));
  };

  const header = (
    <div className="p-d-flex p-jc-between p-ai-center p-flex-wrap">
      <h3>Selected Artworks: {selectedArtworks.length}</h3>
      <Button
        icon={showPanelMobile ? "pi pi-angle-down" : "pi pi-angle-up"}
        label={showPanelMobile ? "Hide Panel" : "Show Panel"}
        className="p-button-sm p-mt-2 p-d-md-none"
        onClick={() => setShowPanelMobile(!showPanelMobile)}
      />
    </div>
  );

  return (
    <div
      className="p-d-flex p-flex-column p-md-flex-row p-m-4"
      style={{ gap: "2rem", alignItems: "flex-start" }}
    >
      <div style={{ flex: 3, width: "100%" }}>
        <DataTable
          value={artworks}
          paginator
          rows={rowsPerPage}
          totalRecords={totalRecords}
          lazy
          first={(page - 1) * rowsPerPage}
          onPage={(e) => setPage(e.page + 1)}
          selection={selectedArtworks.filter((art) =>
            artworks.some((a) => a.id === art.id)
          )}
          onSelectionChange={onSelectionChange}
          dataKey="id"
          selectionMode="checkbox"
          header={header}
          rowHover
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px" }}
        >
          <Column selectionMode="multiple" style={{ width: "3em" }} />
          <Column field="title" header="Title" />
          <Column field="place_of_origin" header="Origin" />
          <Column field="artist_display" header="Artist" />
          <Column field="inscriptions" header="Inscriptions" />
          <Column field="date_start" header="Start Date" />
          <Column field="date_end" header="End Date" />
        </DataTable>
      </div>

      {(showPanelMobile || window.innerWidth >= 768) && (
        <div
          style={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            maxHeight: "80vh",
            position: window.innerWidth >= 768 ? "sticky" : "relative",
            top: window.innerWidth >= 768 ? "1rem" : "0",
            backgroundColor: "#f9f9f9",
            overflowY: "auto",
            width: "100%",
          }}
        >
          <h4>Selected Artworks</h4>
          {selectedArtworks.length === 0 && <p>No artworks selected</p>}
          {selectedArtworks.map((art) => (
            <div
              key={art.id}
              className="p-d-flex p-jc-between p-ai-center p-mb-2"
              style={{
                borderBottom: "1px solid #eee",
                paddingBottom: "0.5rem",
                transition: "all 0.2s",
              }}
            >
              <div style={{ flex: 1 }}>
                <strong>{art.title}</strong>
                <br />
                <small>{art.artist_display}</small>
              </div>
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-danger p-button-text"
                onClick={() => removeFromSelection(art.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtTable;