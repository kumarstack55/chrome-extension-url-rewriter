import { UrlRewriter } from "./rewriters/base.js";
import { XDotComRewriter } from "./rewriters/x-dot-com.js";
import { AmazonCoJpRewriter } from "./rewriters/amazon-co-jp.js";
import { GadRemoverRewriter } from "./rewriters/gad-remover.js";
import { LanguageCountryRewriter } from "./rewriters/language-country.js";
import { LanguageRewriter } from "./rewriters/language.js";
import { NoopRewriter } from "./rewriters/noop.js";
import { KubernetesDotIoRewriter } from "./rewriters/kubernetes-dot-io.js";
import { GoogleRewriter } from "./rewriters/google.js";

export class Result {
  private name: string;
  private url: string;
  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }

  getName(): string {
    return this.name;
  }

  getUrl(): string {
    return this.url;
  }
}

export class ResultSet {
  private results: Result[];

  constructor(results: Result[]) {
    this.results = results;
  }

  isEmpty(): boolean {
    return this.results.length === 0;
  }

  getResults(): Result[] {
    return this.results;
  }
}

export class RewriterMatcher {
  private rewriters: Map<RegExp, UrlRewriter>;
  constructor(rewriters: Map<RegExp, UrlRewriter>) {
    this.rewriters = rewriters;
  }

  match(url: string): ResultSet {
    const results: Result[] = [];

    this.rewriters.forEach((rewriter, pattern) => {
      if (pattern.test(url)) {
        const rewrittenUrl = rewriter.rewriteUrl(url);
        if (rewrittenUrl === null) {
          return;
        }
        const result = new Result(rewriter.getName(), rewrittenUrl);
        results.push(result);
      }
    });

    return new ResultSet(results);
  }
}

export class RewriterFactory {
  private rewriters: Map<RegExp, UrlRewriter>;

  constructor() {
    this.rewriters = new Map<RegExp, UrlRewriter>();
  }

  addRewriter(rewriter: UrlRewriter): void {
    const pattern = rewriter.getRewritablePattern();
    const re = new RegExp(pattern);
    this.rewriters.set(re, rewriter);
  }

  getRewriterMatcher(): RewriterMatcher {
    return new RewriterMatcher(this.rewriters);
  }

  static create(): RewriterFactory {
    const factory = new RewriterFactory();

    // TODO: load configuration

    // site specific rewriters
    factory.addRewriter(new KubernetesDotIoRewriter());
    factory.addRewriter(new AmazonCoJpRewriter());
    factory.addRewriter(new XDotComRewriter());
    factory.addRewriter(new GoogleRewriter());

    // generic rewriters
    factory.addRewriter(new GadRemoverRewriter());
    factory.addRewriter(new LanguageCountryRewriter());
    factory.addRewriter(new LanguageRewriter());

    // noop rewriter (should be last)
    factory.addRewriter(new NoopRewriter());

    return factory;
  }
}
