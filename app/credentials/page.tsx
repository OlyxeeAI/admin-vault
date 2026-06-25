import { getCredentials } from "@/lib/queries";
import { PageHeader } from "@/components/ui";
import CredentialsTable from "@/components/CredentialsTable";

export const dynamic = "force-dynamic";

export default async function CredentialsPage() {
  const credentials = await getCredentials();

  return (
    <div className="animate-ios-in">
      <PageHeader
        title="Credentials"
        subtitle={`${credentials.length} secret${
          credentials.length === 1 ? "" : "s"
        } across all projects · read-only`}
      />
      <CredentialsTable credentials={credentials} />
    </div>
  );
}
