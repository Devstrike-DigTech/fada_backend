export class RegexValidators {
  public static URL(url: string) {
    try {
      return Boolean(new URL(url));
    } catch (e) {
      return false;
    }
  }
}
