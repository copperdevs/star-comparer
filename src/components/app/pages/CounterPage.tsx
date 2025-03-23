import { type PageProps } from "@/lib";
import { BaseAppLayout } from "@/components/app/layouts/BaseAppLayout";
import Counter from "@app/components/testing/Counter";

export default function IndexPage({ props }: { props: PageProps }) {
  return (
    <BaseAppLayout props={props}>
      <div className="pagecenter scrollable">
        <div className="contentcenter">
          <div className="content">
            <Counter />
          </div>
        </div>
      </div>
    </BaseAppLayout>
  );
}
