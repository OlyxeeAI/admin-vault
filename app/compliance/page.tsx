import { getDocuments } from "@/lib/queries";
import { PageHeader } from "@/components/ui";
import ComplianceTable from "@/components/ComplianceTable";

export const dynamic = "force-dynamic";

export default async function CompliancePage() {
  const documents = await getDocuments();

  return (
    <div className="animate-ios-in">
      <PageHeader
        title="Compliance"
        subtitle={`${documents.length} document${
          documents.length === 1 ? "" : "s"
        } with verified checksums · read-only`}
      />
      <ComplianceTable documents={documents} />
    </div>
  );
}
