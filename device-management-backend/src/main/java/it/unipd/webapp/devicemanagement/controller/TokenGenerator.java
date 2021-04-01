package it.unipd.webapp.devicemanagement.controller;

import java.security.SecureRandom;
import java.util.Locale;
import java.util.Objects;
import java.util.Random;

/**
 * Random token generator
 * Source: https://stackoverflow.com/questions/41107/how-to-generate-a-random-alpha-numeric-string
 */
public class TokenGenerator {
    /**
     * Generate a random token.
     */
    public String nextToken() {
        for (int idx = 0; idx < buf.length; ++idx)
            buf[idx] = symbols[random.nextInt(symbols.length)];
        return new String(buf);
    }

    public static final String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public static final String lower = upper.toLowerCase(Locale.ROOT);

    public static final String digits = "0123456789";

    public static final String alphanum = upper + lower + digits;

    private final Random random;

    private final char[] symbols;

    private final char[] buf;

    public TokenGenerator(int length, Random random, String symbols) {
        if (length < 1) throw new IllegalArgumentException();
        if (symbols.length() < 2) throw new IllegalArgumentException();
        this.random = Objects.requireNonNull(random);
        this.symbols = symbols.toCharArray();
        this.buf = new char[length];
    }

    /**
     * Create an alphanumeric token generator.
     */
    public TokenGenerator(int length, Random random) {
        this(length, random, alphanum);
    }

    /**
     * Create alphanumeric tokens from a secure generator.
     */
    public TokenGenerator(int length) {
        this(length, new SecureRandom());
    }

    /**
     * Create a secure token generator with default length 21
     */
    public TokenGenerator() {
        this(21);
    }
}
